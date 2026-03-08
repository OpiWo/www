'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CountUp } from './CountUp';
import type { OpinionStats } from '@/types/opinions.types';
import type { TransitionsData } from '@/hooks/useTransitions';

interface KpiStripProps {
  stats: OpinionStats;
  transitions: TransitionsData | undefined;
  isAuth: boolean;
}

export function KpiStrip({ stats, transitions, isAuth }: KpiStripProps) {
  const t = useTranslations('topic_detail');

  const leading =
    stats.options.length > 0
      ? stats.options.reduce(
          (max, o) => (o.percentage > max.percentage ? o : max),
          stats.options[0],
        )
      : null;

  let changedPct: string | null = null;
  if (isAuth && transitions && stats.total > 0) {
    const changers = transitions.transitions
      .filter((tr) => tr.from !== null)
      .reduce((s, tr) => s + tr.count, 0);
    changedPct = ((changers / stats.total) * 100).toFixed(1);
  }

  const cards = [
    {
      label: t('kpi_total'),
      value: (
        <span className="text-3xl font-bold text-foreground">
          <CountUp value={stats.total} />
        </span>
      ),
      subtext: (
        <span className="text-xs text-muted-foreground">{t('kpi_total')}</span>
      ),
    },
    {
      label: t('kpi_leading_label'),
      value: leading ? (
        <span className="text-xl font-bold text-primary capitalize leading-tight">
          {leading.optionValue}
        </span>
      ) : (
        <span className="text-xl font-bold text-muted-foreground">—</span>
      ),
      subtext: leading ? (
        <span className="text-xs text-muted-foreground tabular-nums">
          {leading.percentage.toFixed(1)}%
        </span>
      ) : null,
    },
    {
      label: t('kpi_switched_label'),
      value: !isAuth ? (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Lock className="size-3.5" />
          {t('kpi_auth_required')}
        </span>
      ) : changedPct !== null ? (
        <span className="text-3xl font-bold text-foreground">
          {changedPct}%
        </span>
      ) : (
        <span className="text-3xl font-bold text-muted-foreground">—</span>
      ),
      subtext: (
        <span className="text-xs text-muted-foreground">{t('kpi_switched')}</span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-muted/40 rounded-2xl px-5 py-4"
        >
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-2">
            {card.label}
          </p>
          <div className="mb-1">{card.value}</div>
          {card.subtext}
        </motion.div>
      ))}
    </div>
  );
}
