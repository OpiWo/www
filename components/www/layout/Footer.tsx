'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Amber glow behind wordmark */}
      <div
        className="pointer-events-none absolute -top-20 left-0 w-[600px] h-[300px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'oklch(0.769 0.18 67)' }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-10 md:pb-14 relative z-10">

        {/* Big wordmark */}
        <div className="mb-6 md:mb-8">
          <span className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-none">
            <span className="text-background">Opi</span>
            <span style={{ color: 'oklch(0.769 0.18 67)' }}>Wo</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-base text-background/45 max-w-md leading-relaxed mb-12 md:mb-16">
          {t('tagline')}
        </p>

        {/* Single row nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-6 md:gap-10">
            <li>
              <Link
                href="/topics"
                className="text-sm text-background/55 hover:text-background/85 transition-colors duration-150"
              >
                {nav('topics')}
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-sm text-background/55 hover:text-background/85 transition-colors duration-150"
              >
                {nav('login')}
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-sm text-background/55 hover:text-background/85 transition-colors duration-150"
              >
                {nav('register')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom bar */}
        <div className="mt-16 md:mt-20 pt-6 border-t border-background/10 flex items-center justify-between">
          <p className="text-xs text-background/35">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="text-xs text-background/25">opiwo.com</p>
        </div>
      </div>
    </footer>
  );
}
