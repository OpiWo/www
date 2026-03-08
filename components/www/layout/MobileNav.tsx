'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
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

export function MobileNav() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

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
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                {t('login')}
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full">
                {t('register')}
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
