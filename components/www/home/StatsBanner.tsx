'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
}

function StatItem({ value, label, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="flex flex-col items-center gap-1 px-6 py-2"
    >
      <span className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
        {value}
      </span>
      <span className="text-sm text-muted-foreground text-center">{label}</span>
    </motion.div>
  );
}

export function StatsBanner() {
  const t = useTranslations('home');
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { once: true });

  const stats = [
    { value: '5,200+', labelKey: 'stats_users', delay: 0 },
    { value: '340+', labelKey: 'stats_topics', delay: 0.1 },
    { value: '28,000+', labelKey: 'stats_opinions', delay: 0.2 },
  ] as const;

  return (
    <section ref={ref} className="border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-border/60 gap-0">
          {stats.map((stat) => (
            <StatItem
              key={stat.labelKey}
              value={stat.value}
              label={t(stat.labelKey)}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
