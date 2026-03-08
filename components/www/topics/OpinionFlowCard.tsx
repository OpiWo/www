'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransitions } from '@/hooks/useTransitions';
import { AnalyticsLock } from './AnalyticsLock';
import type { TopicDetail } from '@/types/topics.types';

const FIRST_VOTE_KEY = 'first_vote';

interface OpinionFlowCardProps {
  topic: TopicDetail;
  isAuth: boolean;
}

export function OpinionFlowCard({ topic, isAuth }: OpinionFlowCardProps) {
  const t = useTranslations('topic_detail');
  const { data, isLoading } = useTransitions(topic.id, isAuth);

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Build matrix
  const toValues = options.map((o) => o.value);

  // Collect unique "from" values
  const fromValues: string[] = [FIRST_VOTE_KEY];
  options.forEach((o) => {
    if (!fromValues.includes(o.value)) fromValues.push(o.value);
  });

  // matrix[from][to] = count
  const matrix: Record<string, Record<string, number>> = {};
  fromValues.forEach((from) => {
    matrix[from] = {};
    toValues.forEach((to) => {
      matrix[from][to] = 0;
    });
  });

  if (data) {
    data.transitions.forEach((tr) => {
      const fromKey = tr.from === null ? FIRST_VOTE_KEY : tr.from;
      if (matrix[fromKey] !== undefined && matrix[fromKey][tr.to] !== undefined) {
        matrix[fromKey][tr.to] = tr.count;
      }
    });
  }

  const allCounts = fromValues.flatMap((from) => toValues.map((to) => matrix[from][to]));
  const maxCount = Math.max(...allCounts, 1);

  // Check if there are any real transitions (from !== null)
  const hasTransitions =
    data &&
    data.transitions.some((tr) => tr.from !== null && tr.count > 0);

  // Most common switch (from !== null)
  let mostCommon: { from: string; to: string; count: number } | null = null;
  if (data) {
    for (const tr of data.transitions) {
      if (tr.from !== null && tr.count > 0) {
        if (!mostCommon || tr.count > mostCommon.count) {
          mostCommon = { from: tr.from, to: tr.to, count: tr.count };
        }
      }
    }
  }

  const fromLabel = (key: string) =>
    key === FIRST_VOTE_KEY ? t('flow_first_vote') : key;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-0.5 h-4 bg-primary rounded-full" />
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
            {t('flow_title')}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('flow_subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {isLoading && <Skeleton className="h-40 w-full rounded-lg" />}

        {!isLoading && isAuth && data && !hasTransitions && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-6 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">{t('flow_no_changes')}</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                {t('flow_no_changes_sub')}
              </p>
            </div>
          </div>
        )}

        {!isLoading && isAuth && data && hasTransitions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {/* Matrix table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-right pr-3 pb-2 text-muted-foreground font-medium w-24">
                      →
                    </th>
                    {toValues.map((to) => (
                      <th
                        key={to}
                        className="pb-2 px-2 text-center text-muted-foreground font-medium capitalize min-w-[64px]"
                      >
                        {to}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fromValues.map((from) => (
                    <tr key={from}>
                      <td className="text-right pr-3 py-1.5 text-muted-foreground font-medium capitalize whitespace-nowrap">
                        {fromLabel(from)}
                      </td>
                      {toValues.map((to) => {
                        const count = matrix[from]?.[to] ?? 0;
                        const opacity = count > 0 ? (count / maxCount) * 0.8 : 0;
                        return (
                          <td
                            key={to}
                            className="py-1.5 px-2 text-center rounded transition-all"
                            style={{
                              background:
                                count > 0
                                  ? `oklch(0.769 0.18 67 / ${opacity})`
                                  : 'transparent',
                            }}
                          >
                            {count > 0 ? (
                              <span className="font-medium text-foreground tabular-nums">
                                {count.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary line */}
            {mostCommon && (
              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                {t('flow_most_common', {
                  from: mostCommon.from,
                  to: mostCommon.to,
                  count: mostCommon.count,
                })}
              </p>
            )}
          </motion.div>
        )}

        {!isAuth && (
          <AnalyticsLock
            title={t('flow_locked_title')}
            description={t('flow_locked_subtitle')}
          />
        )}
      </div>
    </div>
  );
}
