'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useOpinionStats } from '@/hooks/useOpinionStats';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TopicDetail } from '@/types/topics.types';

const CHART_COLORS = [
  '#f59e0b',
  '#0ea5e9',
  '#10b981',
  '#8b5cf6',
  '#f43f5e',
  '#94a3b8',
];

type ChartView = 'bar' | 'donut';

interface ResultsChartCardProps {
  topic: TopicDetail;
}

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-3 w-20 shrink-0" />
          <Skeleton className="h-7 rounded-md" style={{ width: `${80 - i * 18}%` }} />
          <Skeleton className="h-3 w-10 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function ResultsChartCard({ topic }: ResultsChartCardProps) {
  const t = useTranslations('topic_detail');
  const [view, setView] = useState<ChartView>('bar');

  // Results are public — always enabled
  const { data: stats, isLoading, isError } = useOpinionStats(topic.id, true);

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const total = stats?.total ?? 0;

  const leadingOption =
    stats && stats.options.length > 0
      ? stats.options.reduce(
          (max, o) => (o.percentage > max.percentage ? o : max),
          stats.options[0],
        )
      : null;

  const pieData = options.map((opt, idx) => {
    const stat = stats?.options.find((o) => o.optionValue === opt.value);
    return {
      name: opt.value,
      value: stat?.count ?? 0,
      percentage: stat?.percentage ?? 0,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    };
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-4 bg-primary rounded-full" />
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
              {t('results_title')}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('results_total', { count: total })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setView('bar')}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg transition-colors',
              view === 'bar'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted',
            )}
            aria-label={t('results_view_bar')}
          >
            <BarChart2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setView('donut')}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg transition-colors',
              view === 'donut'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted',
            )}
            aria-label={t('results_view_donut')}
          >
            <PieChartIcon className="size-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading && <ChartSkeleton />}

      {isError && !isLoading && (
        <p className="text-center text-sm text-muted-foreground py-8">
          {t('results_error')}
        </p>
      )}

      {!isLoading && !isError && stats && (
        <AnimatePresence mode="wait">
          {view === 'bar' ? (
            <motion.div
              key="bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {options.map((option, idx) => {
                const stat = stats.options.find((o) => o.optionValue === option.value);
                const count = stat?.count ?? 0;
                const pct = stat?.percentage ?? 0;
                const color = CHART_COLORS[idx % CHART_COLORS.length];
                const barWidth = total > 0 ? `${pct}%` : '0%';
                const isLeading = leadingOption?.optionValue === option.value;

                return (
                  <div key={option.id} className={cn(isLeading ? 'opacity-100' : 'opacity-85')}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground capitalize">
                          {option.value}
                        </span>
                        {isLeading && (
                          <span
                            className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            {t('results_leading_badge')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                        <span>{count.toLocaleString()}</span>
                        <span className="font-semibold" style={{ color }}>
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
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
              {total === 0 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {t('results_empty')}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="donut"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {total === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  {t('results_empty')}
                </p>
              ) : (
                <div className="relative">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={110}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value, name) => {
                          const numVal = typeof value === 'number' ? value : Number(value);
                          const nameStr = String(name);
                          const entry = pieData.find((d) => d.name === nameStr);
                          return [
                            `${numVal.toLocaleString()} (${entry?.percentage.toFixed(1)}%)`,
                            nameStr,
                          ];
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        formatter={(value) => (
                          <span className="capitalize text-xs">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center text */}
                  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-lg font-bold text-foreground tabular-nums leading-tight">
                      {total.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">total</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
