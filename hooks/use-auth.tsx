'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/auth.types';
import { authApi } from '@/lib/api/auth.api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the current user from /users/me
  const fetchMe = useCallback(async (): Promise<boolean> => {
    try {
      const res = await authApi.getMe();
      setUser(res.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Attempt token refresh
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await authApi.refreshToken();
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', res.accessToken);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  // Store token + load user
  const login = useCallback(
    async (accessToken: string): Promise<void> => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
      }
      await fetchMe();
    },
    [fetchMe],
  );

  // Logout: call API, then clear local state
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // ignore — we clear state regardless
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setUser(null);
  }, []);

  // Rehydrate on mount
  useEffect(() => {
    const rehydrate = async () => {
      setIsLoading(true);
      const storedToken =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const ok = await fetchMe();
      if (!ok) {
        // Token might be expired — try refreshing
        const refreshed = await refreshToken();
        if (refreshed) {
          await fetchMe();
        } else {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    rehydrate();
  }, [fetchMe, refreshToken]);

  // Listen for auth:logout events dispatched by the axios interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
