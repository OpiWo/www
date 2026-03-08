'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { useDemographics } from '@/hooks/useAnalytics';
import { AnalyticsLock } from './AnalyticsLock';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TopicDetail } from '@/types/topics.types';

const CHART_COLORS = ['#f59e0b', '#0ea5e9', '#10b981', '#8b5cf6', '#f43f5e', '#94a3b8'];

interface DemographicsSectionProps {
  topic: TopicDetail;
  isAuth: boolean;
}

type DemoGroupKey = 'by_gender' | 'by_age_range';

function GroupedBarChart({
  topic,
  groupKey,
  breakdown,
}: {
  topic: TopicDetail;
  groupKey: DemoGroupKey;
  breakdown: Record<string, { count: number; percentage: number; demographics: { by_gender: Record<string, { count: number; percentage: number }>; by_country: Record<string, { count: number; percentage: number }>; by_age_range: Record<string, { count: number; percentage: number }> } }>;
}) {
  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Invert: { bucketLabel -> { optionValue -> { count, percentage } } }
  const byBucket: Record<string, Record<string, { count: number; percentage: number }>> = {};

  for (const [optionValue, data] of Object.entries(breakdown)) {
    const demoBuckets = data.demographics[groupKey];
    for (const [bucketLabel, val] of Object.entries(demoBuckets)) {
      if (!byBucket[bucketLabel]) byBucket[bucketLabel] = {};
      byBucket[bucketLabel][optionValue] = val;
    }
  }

  const chartData = Object.entries(byBucket).map(([label, opts]) => {
    const row: Record<string, string | number> = { label };
    options.forEach((opt) => {
      row[opt.value] = opts[opt.value]?.count ?? 0;
    });
    return row;
  });

  if (chartData.length === 0) {
    return <p className="text-xs text-muted-foreground text-center py-4">No data</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 48)}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
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
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        {options.map((opt, idx) => (
          <Bar
            key={opt.id}
            dataKey={opt.value}
            fill={CHART_COLORS[idx % CHART_COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DemographicsSection({ topic, isAuth }: DemographicsSectionProps) {
  const t = useTranslations('topic_detail');
  const { data, isLoading, isError } = useDemographics(topic.id, isAuth);

  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-0.5 h-4 bg-primary rounded-full" />
        <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
          Demographics
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      )}

      {!isLoading && isError && (
        <p className="text-center text-sm text-muted-foreground py-8">
          {t('demographics_error')}
        </p>
      )}

      {!isLoading && !isError && data && (
        <div className="space-y-6">
          {/* Top row: Gender + Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Gender */}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
                {t('demo_title_gender')}
              </p>
              <GroupedBarChart topic={topic} groupKey="by_gender" breakdown={data.breakdown} />
            </div>

            {/* By Age Group */}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
                {t('demo_title_age')}
              </p>
              <GroupedBarChart topic={topic} groupKey="by_age_range" breakdown={data.breakdown} />
            </div>
          </div>

          {/* Bottom: By Country */}
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                {t('demo_title_country')}
              </p>
              <p className="text-[10px] text-muted-foreground">{t('demo_country_subtitle')}</p>
            </div>
            <CountryList topic={topic} breakdown={data.breakdown} />
          </div>
        </div>
      )}

      {!isAuth && (
        <AnalyticsLock
          title={t('demo_locked_title')}
          description={t('demo_locked_subtitle')}
        />
      )}
    </div>
  );
}

function CountryList({
  topic,
  breakdown,
}: {
  topic: TopicDetail;
  breakdown: Record<string, { count: number; percentage: number; demographics: { by_gender: Record<string, { count: number; percentage: number }>; by_country: Record<string, { count: number; percentage: number }>; by_age_range: Record<string, { count: number; percentage: number }> } }>;
}) {
  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Aggregate all options per country
  const countryTotals: Record<string, number> = {};

  for (const [, data] of Object.entries(breakdown)) {
    for (const [countryLabel, val] of Object.entries(data.demographics.by_country)) {
      countryTotals[countryLabel] = (countryTotals[countryLabel] ?? 0) + val.count;
    }
  }

  const sorted = Object.entries(countryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCount = sorted[0]?.[1] ?? 1;

  if (sorted.length === 0) {
    return <p className="text-xs text-muted-foreground text-center py-4">No data</p>;
  }

  // Suppress unused warning — options used in parent for consistency
  void options;

  return (
    <div className="space-y-2">
      {sorted.map(([country, count], idx) => (
        <motion.div
          key={country}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <span className="text-[10px] text-muted-foreground tabular-nums w-5 text-right shrink-0">
            {idx + 1}
          </span>
          <span className="text-sm font-medium text-foreground w-24 shrink-0 truncate">
            {country}
          </span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(count / maxCount) * 100}%` }}
              transition={{ delay: 0.1 + idx * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-right shrink-0">
            {count.toLocaleString()}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
