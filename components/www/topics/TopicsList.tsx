'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/www/shared/EmptyState';
import { TopicCard } from '@/components/www/topics/TopicCard';
import { useTopicsInfinite } from '@/hooks/useTopics';
import type { TopicsResponse } from '@/types/topics.types';

interface TopicsListProps {
  initialData: TopicsResponse;
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
    transition: { staggerChildren: 0.06 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export function TopicsList({ initialData }: TopicsListProps) {
  const t = useTranslations('topics');
  const searchParams = useSearchParams();

  const tagId = searchParams.get('tag') ?? undefined;
  const optionSetId = searchParams.get('optionSet') ?? undefined;
  const lang = searchParams.get('lang') ?? undefined;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useTopicsInfinite(
      { tagId, optionSetId, lang, limit: 20 },
      initialData,
    );

  const allTopics = data?.pages.flatMap((page) => page.topics) ?? [];

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      ) : allTopics.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={t('empty_title')}
          description={t('empty_description')}
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tagId ?? 'all'}-${optionSetId ?? 'all'}-${lang ?? 'all'}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {allTopics.map((topic) => (
              <motion.div key={topic.id} variants={cardItem}>
                <TopicCard topic={topic} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Load more */}
      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-full border-border px-8 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t('loading_more')}
              </>
            ) : (
              t('load_more')
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
