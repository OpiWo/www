'use client';

import { useTranslations } from 'next-intl';
import { useTopics } from '@/hooks/useTopics';
import { TopicCard } from '@/components/www/topics/TopicCard';
import { EmptyState } from '@/components/www/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import type { TopicsResponse, Topic } from '@/types/topics.types';
import { motion, type Variants } from 'framer-motion';

interface TrendingTopicsProps {
  initialTopics: Topic[];
}

function TopicCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-18 rounded-full" />
      </div>
    </div>
  );
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TrendingTopics({ initialTopics }: TrendingTopicsProps) {
  const t = useTranslations('home');

  const initialData: TopicsResponse | undefined =
    initialTopics.length > 0
      ? {
          success: true,
          topics: initialTopics,
          pagination: { limit: 6, hasMore: false, nextCursor: null },
        }
      : undefined;

  const { data, isLoading } = useTopics({ limit: 6 }, initialData);

  const topics = data?.topics ?? [];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
              {t('trending_eyebrow')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t('trending_title')}
            </h2>
          </div>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <TopicCardSkeleton key={i} />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={t('trending_empty')}
          />
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {topics.slice(0, 6).map((topic) => (
              <motion.div key={topic.id} variants={cardItem}>
                <TopicCard topic={topic} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
