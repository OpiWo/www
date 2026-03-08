'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">

        {/* Top row: wordmark left, nav links right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Wordmark */}
          <span className="text-2xl font-bold tracking-tight leading-none">
            <span className="text-background">Opi</span>
            <span style={{ color: 'oklch(0.769 0.18 67)' }}>Wo</span>
          </span>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-6">
              <li>
                <Link href="/topics" className="text-sm text-background/55 hover:text-background/85 transition-colors duration-150">
                  {nav('topics')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-background/55 hover:text-background/85 transition-colors duration-150">
                  {nav('login')}
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-background/55 hover:text-background/85 transition-colors duration-150">
                  {nav('register')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-background/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-background/35">{t('copyright', { year: currentYear })}</p>
          <p className="text-xs text-background/25 max-w-xs sm:max-w-sm leading-relaxed">{t('tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
