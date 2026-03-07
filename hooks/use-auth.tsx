'use client';
import { createContext, useContext, useState } from 'react';

interface AuthContextValue {
  user: null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading] = useState(false);

  return (
    <AuthContext.Provider value={{
      user: null,
      isLoading,
      login: async () => {},
      logout: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
