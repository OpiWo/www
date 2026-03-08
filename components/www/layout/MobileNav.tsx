'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Link } from '@/lib/i18n/navigation';
import { LocaleSwitcher } from '@/components/www/shared/LocaleSwitcher';
import { ThemeToggle } from '@/components/www/shared/ThemeToggle';
import type { User as UserType } from '@/types/auth.types';

interface MobileNavProps {
  user?: UserType;
  onLogout?: () => Promise<void>;
  isLoading?: boolean;
}

export function MobileNav({ user, onLogout, isLoading }: MobileNavProps) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    if (onLogout) {
      await onLogout();
    }
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open menu" className="md:hidden" />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>

      <SheetContent side="right" className="w-72 p-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <SheetTitle>
            <Link href="/" onClick={() => setOpen(false)}>
              <img src="/logo.svg" alt="OpiWo" className="h-7 dark:hidden" />
              <img src="/logo-dark.svg" alt="OpiWo" className="h-7 hidden dark:block" />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-5 pt-5 gap-1">
          <Link
            href="/topics"
            onClick={() => setOpen(false)}
            className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {t('topics')}
          </Link>
          {user && (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <User className="size-4" />
              {t('profile')}
            </Link>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>

          {isLoading ? (
            <div className="h-8 w-full rounded-lg bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="size-3 text-primary-foreground" />
                </span>
                <span className="text-sm font-medium truncate">{user.displayName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="size-3.5" />
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  {t('login')}
                </Button>
              </Link>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">
                  {t('register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
