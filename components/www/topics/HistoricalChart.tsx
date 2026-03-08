'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Lock, TrendingUp } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useHistorical } from '@/hooks/useAnalytics';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TopicDetail } from '@/types/topics.types';

const CHART_COLORS = ['#f59e0b', '#0ea5e9', '#10b981', '#8b5cf6', '#f43f5e', '#94a3b8'];

type Period = 'weekly' | 'monthly' | 'yearly';

interface HistoricalChartProps {
  topic: TopicDetail;
}

function LockedHistorical() {
  const t = useTranslations('topic_detail');
  const locale = useLocale();
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <Lock className="size-5 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{t('locked_trend_title')}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          {t('locked_trend_subtitle')}
        </p>
      </div>
      <Link
        href={`/${locale}/login`}
        className={cn(buttonVariants({ size: 'sm' }), 'bg-primary text-primary-foreground hover:bg-primary/90')}
      >
        {t('locked_cta')}
      </Link>
    </div>
  );
}

function HistSkeleton() {
  return (
    <div className="space-y-3 py-4">
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}

export function HistoricalChart({ topic }: HistoricalChartProps) {
  const t = useTranslations('topic_detail');
  const { user } = useAuth();
  const isAuth = !!user;
  const [period, setPeriod] = useState<Period>('weekly');

  const { data, isLoading, isError } = useHistorical(topic.id, period, isAuth);

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const periods: { value: Period; label: string }[] = [
    { value: 'weekly', label: t('period_weekly') },
    { value: 'monthly', label: t('period_monthly') },
    { value: 'yearly', label: t('period_yearly') },
  ];

  if (!isAuth) {
    return <LockedHistorical />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Period selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{t('trend_subtitle')}</span>
        </div>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                period === p.value
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <HistSkeleton />}

      {isError && (
        <p className="text-center text-sm text-muted-foreground py-8">{t('trend_error')}</p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">{t('trend_empty')}</p>
      )}

      {data && data.data.length > 0 && (() => {
        const chartData = data.data.map((point) => {
          const row: Record<string, string | number> = { period: point.period };
          options.forEach((opt) => {
            row[opt.value] = point.breakdown[opt.value]?.count ?? 0;
          });
          return row;
        });

        return (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <defs>
                {options.map((opt, idx) => (
                  <linearGradient key={opt.id} id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[idx % CHART_COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[idx % CHART_COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              />
              {options.map((opt, idx) => (
                <Area
                  key={opt.id}
                  type="monotone"
                  dataKey={opt.value}
                  stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                  strokeWidth={2}
                  fill={`url(#grad-${idx})`}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      })()}
    </motion.div>
  );
}
