'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Lock } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useOpinionStats } from '@/hooks/useOpinionStats';
import type { TopicDetail } from '@/types/topics.types';

const CHART_COLORS = [
  '#f59e0b', // amber
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f43f5e', // rose
  '#94a3b8', // slate
];

interface OptionsResultsChartProps {
  topic: TopicDetail;
}

function LockedCard() {
  const t = useTranslations('topic_detail');
  const locale = useLocale();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
      {/* Blurred bar preview */}
      <div className="mb-8 space-y-3 blur-sm pointer-events-none select-none" aria-hidden>
        {[75, 45, 30, 20].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-24 text-xs text-muted-foreground text-right shrink-0">Option {i + 1}</div>
            <div
              className="h-7 rounded-md"
              style={{
                width: `${w}%`,
                background: CHART_COLORS[i % CHART_COLORS.length],
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-[2px] rounded-2xl gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted border border-border">
          <Lock className="size-5 text-muted-foreground" />
        </div>
        <div className="text-center px-4">
          <p className="font-semibold text-foreground mb-1">{t('locked_results_title')}</p>
          <p className="text-sm text-muted-foreground">{t('locked_results_subtitle')}</p>
        </div>
        <Link
          href={`/${locale}/login`}
          className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
        >
          {t('locked_cta')}
        </Link>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-3 w-48" />
      <div className="space-y-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 w-20 shrink-0" />
            <Skeleton className="h-7 rounded-md" style={{ width: `${80 - i * 18}%` }} />
            <Skeleton className="h-3 w-10 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OptionsResultsChart({ topic }: OptionsResultsChartProps) {
  const t = useTranslations('topic_detail');
  const { user } = useAuth();
  const isAuth = !!user;

  const { data: stats, isLoading, isError } = useOpinionStats(topic.id, isAuth);

  if (!isAuth) {
    return <LockedCard />;
  }

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError || !stats) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{t('results_error')}</p>
      </div>
    );
  }

  const total = stats.total;
  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t('results_title')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('results_total', { count: total })}
          </p>
        </div>
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {total.toLocaleString()}
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {options.map((option, idx) => {
          const stat = stats.options.find((o) => o.optionValue === option.value);
          const count = stat?.count ?? 0;
          const pct = stat?.percentage ?? 0;
          const color = CHART_COLORS[idx % CHART_COLORS.length];
          const barWidth = total > 0 ? `${pct}%` : '0%';

          return (
            <div key={option.id} className="group">
              {/* Label row */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground capitalize">
                  {option.value}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                  <span>{count.toLocaleString()}</span>
                  <span className="font-semibold" style={{ color }}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="h-7 w-full rounded-lg bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-lg"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: barWidth }}
                  transition={{
                    duration: 0.8,
                    delay: 0.05 * idx,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-6">{t('results_empty')}</p>
      )}
    </motion.div>
  );
}
