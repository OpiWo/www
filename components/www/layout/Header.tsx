'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/www/shared/LocaleSwitcher';
import { ThemeToggle } from '@/components/www/shared/ThemeToggle';
import { MobileNav } from '@/components/www/layout/MobileNav';
import { usePathname } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();

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
            <div className="hidden md:block ml-1">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  {t('login')}
                </Button>
              </Link>
            </div>
            {/* Mobile hamburger */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
