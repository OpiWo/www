'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="col-span-1">
            <div className="mb-3">
              {/* Wordmark in footer — "Opi" light, "Wo" amber */}
              <span className="text-xl font-semibold tracking-tight">
                <span className="text-background">Opi</span>
                <span style={{ color: 'oklch(0.769 0.18 67)' }}>Wo</span>
              </span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-background/40 mb-4">
              {t('nav_heading')}
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href="/topics"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  {nav('topics')}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  {nav('login')}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  {nav('register')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / placeholder column */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-background/40 mb-4">
              {t('community_heading')}
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <span className="text-sm text-background/40 cursor-default">
                  Twitter / X
                </span>
              </li>
              <li>
                <span className="text-sm text-background/40 cursor-default">
                  Discord
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/40">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="text-xs text-background/30 font-mono">
            opiwo.com
          </p>
        </div>
      </div>
    </footer>
  );
}
