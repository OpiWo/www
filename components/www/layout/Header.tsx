'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/www/shared/LocaleSwitcher';
import { ThemeToggle } from '@/components/www/shared/ThemeToggle';
import { MobileNav } from '@/components/www/layout/MobileNav';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      toast.success(tAuth('sign_out_success'));
      router.push('/');
    } catch {
      toast.error(tAuth('sign_out_error'));
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.svg" alt="OpiWo" className="h-8 dark:hidden" />
            <img src="/logo-dark.svg" alt="OpiWo" className="h-8 hidden dark:block" />
          </Link>

          {/* Center nav — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/topics"
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                pathname === '/topics'
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
              )}
            >
              {t('topics')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />

            {/* Auth controls — desktop */}
            <div className="hidden md:flex items-center gap-1 ml-1">
              {isLoading ? (
                <div className="h-7 w-20 rounded-lg bg-muted animate-pulse" />
              ) : user ? (
                <UserMenu
                  displayName={user.displayName}
                  onLogout={handleLogout}
                />
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {t('login')}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <MobileNav user={user ?? undefined} onLogout={handleLogout} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  displayName,
  onLogout,
}: {
  displayName: string;
  onLogout: () => Promise<void>;
}) {
  const t = useTranslations('nav');
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 h-7 px-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors" />
        }
      >
        <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
          <User className="size-3 text-primary-foreground" />
        </span>
        <span className="max-w-[120px] truncate">{displayName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="size-3.5" />
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut className="size-3.5" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
