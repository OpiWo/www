'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Lock, Users } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useDemographics } from '@/hooks/useAnalytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TopicDetail } from '@/types/topics.types';
import type { DemographicsData } from '@/types/analytics.types';

const CHART_COLORS = ['#f59e0b', '#0ea5e9', '#10b981', '#8b5cf6', '#f43f5e', '#94a3b8'];

interface DemographicsPanelProps {
  topic: TopicDetail;
}

function LockedDemographics() {
  const t = useTranslations('topic_detail');
  const locale = useLocale();
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <Lock className="size-5 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{t('locked_demographics_title')}</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          {t('locked_demographics_subtitle')}
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

function DemoSkeleton() {
  return (
    <div className="space-y-3 py-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-8 w-full rounded" />
      ))}
    </div>
  );
}

type DemoKey = 'by_gender' | 'by_country' | 'by_age_range';

function DemoBarChart({
  data,
  demoKey,
  optionValue,
  colorIndex,
}: {
  data: DemographicsData;
  demoKey: DemoKey;
  optionValue: string;
  colorIndex: number;
}) {
  const breakdown = data.breakdown[optionValue];
  if (!breakdown) return null;
  const buckets = breakdown.demographics[demoKey];
  const chartData = Object.entries(buckets).map(([label, val]) => ({
    label,
    count: val.count,
    pct: val.percentage,
  }));

  if (chartData.length === 0) return null;
  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];

  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-muted-foreground capitalize mb-2">{optionValue}</p>
      <ResponsiveContainer width="100%" height={Math.max(60, chartData.length * 32)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={80}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
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
            formatter={(value, _, entry) => [
              `${String(value)} (${(entry as { payload: { pct: number } }).payload.pct.toFixed(1)}%)`,
              'Count',
            ]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} isAnimationActive={true}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={color} fillOpacity={0.85 - i * 0.05} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DemographicsPanel({ topic }: DemographicsPanelProps) {
  const t = useTranslations('topic_detail');
  const { user } = useAuth();
  const isAuth = !!user;

  const { data, isLoading, isError } = useDemographics(topic.id, isAuth);

  const options = topic.optionsSnapshot.options
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!isAuth) {
    return <LockedDemographics />;
  }

  if (isLoading) {
    return <DemoSkeleton />;
  }

  if (isError || !data) {
    return (
      <p className="text-center text-sm text-muted-foreground py-8">{t('demographics_error')}</p>
    );
  }

  const tabs: { key: DemoKey; label: string }[] = [
    { key: 'by_gender', label: t('demo_gender') },
    { key: 'by_country', label: t('demo_country') },
    { key: 'by_age_range', label: t('demo_age') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="size-4 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          {t('demographics_total', { count: data.total })}
        </p>
      </div>
      <Tabs defaultValue={tabs[0].key}>
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-0">
            <div className="space-y-4">
              {options.map((opt, idx) => (
                <DemoBarChart
                  key={opt.id}
                  data={data}
                  demoKey={tab.key}
                  optionValue={opt.value}
                  colorIndex={idx}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
