'use client';

import { Lock } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';

interface AnalyticsLockProps {
  title: string;
  description: string;
}

export function AnalyticsLock({ title, description }: AnalyticsLockProps) {
  const t = useTranslations('topic_detail');

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl backdrop-blur-[6px] bg-background/65">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <Lock className="size-5 text-primary" />
      </div>
      <div className="text-center px-6 max-w-xs">
        <p className="font-semibold text-foreground mb-1">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {t('locked_cta')} →
      </Link>
    </div>
  );
}
