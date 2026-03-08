'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useHistorical } from '@/hooks/useAnalytics';
import { AnalyticsLock } from './AnalyticsLock';
import {
  AreaChart,
  Area,
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

type Period = 'weekly' | 'monthly' | 'yearly';
type ChartView = 'area' | 'bar';

interface TrendChartCardProps {
  topic: TopicDetail;
  isAuth: boolean;
}

export function TrendChartCard({ topic, isAuth }: TrendChartCardProps) {
  const t = useTranslations('topic_detail');
  const [period, setPeriod] = useState<Period>('weekly');
  const [chartView, setChartView] = useState<ChartView>('area');

  const { data, isLoading, isError } = useHistorical(topic.id, period, isAuth);

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const periods: { value: Period; label: string }[] = [
    { value: 'weekly', label: 'W' },
    { value: 'monthly', label: 'M' },
    { value: 'yearly', label: 'Y' },
  ];

  const chartData = data?.data.map((pt) => {
    const row: Record<string, string | number> = { period: pt.period };
    options.forEach((opt) => {
      row[opt.value] = pt.breakdown[opt.value]?.percentage ?? 0;
    });
    return row;
  }) ?? [];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-4 bg-primary rounded-full" />
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
              {t('trend_title')}
            </p>
            {data && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {data.start_date} → {data.end_date}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Period pills */}
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-md transition-colors font-medium',
                  period === p.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-border" />

          {/* View toggle */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setChartView('area')}
              className={cn(
                'flex size-7 items-center justify-center rounded-md transition-colors',
                chartView === 'area'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <TrendingUp className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartView('bar')}
              className={cn(
                'flex size-7 items-center justify-center rounded-md transition-colors',
                chartView === 'bar'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <BarChart2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart content — auth-gated */}
      <div className="relative">
        {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}

        {!isLoading && isError && (
          <p className="text-center text-sm text-muted-foreground py-8">
            {t('trend_error')}
          </p>
        )}

        {!isLoading && !isError && data && data.data.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            {t('trend_empty')}
          </p>
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <AnimatePresence mode="wait">
            {chartView === 'area' ? (
              <motion.div
                key="area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      {options.map((opt, idx) => (
                        <linearGradient key={opt.id} id={`trend-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS[idx % CHART_COLORS.length]}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS[idx % CHART_COLORS.length]}
                            stopOpacity={0}
                          />
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
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => {
                        const numVal = typeof value === 'number' ? value : Number(value);
                        return [`${numVal.toFixed(1)}%`];
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    {options.map((opt, idx) => (
                      <Area
                        key={opt.id}
                        type="monotone"
                        dataKey={opt.value}
                        stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                        strokeWidth={2}
                        fill={`url(#trend-grad-${idx})`}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div
                key="bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => {
                        const numVal = typeof value === 'number' ? value : Number(value);
                        return [`${numVal.toFixed(1)}%`];
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    {options.map((opt, idx) => (
                      <Bar
                        key={opt.id}
                        dataKey={opt.value}
                        stackId="a"
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {!isAuth && (
          <AnalyticsLock
            title={t('trend_locked_title')}
            description={t('trend_locked_subtitle')}
          />
        )}
      </div>
    </div>
  );
}
