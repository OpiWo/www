'use client';

import { useEffect } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoginFlow } from '@/components/www/auth/LoginFlow';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  // Don't flash the form if already logged in
  if (isLoading || user) return null;

  return <LoginFlow />;
}
