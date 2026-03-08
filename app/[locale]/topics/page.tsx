import { getTranslations, getLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { TopicFilters } from '@/components/www/topics/TopicFilters';
import { TopicsList } from '@/components/www/topics/TopicsList';
import { Skeleton } from '@/components/ui/skeleton';
import type { TopicsResponse } from '@/types/topics.types';
import type { Tag, TagsResponse } from '@/types/tags.types';
import type { OptionSet, OptionSetsResponse } from '@/types/option-sets.types';

interface TopicsPageProps {
  searchParams: Promise<{
    tag?: string;
    optionSet?: string;
    lang?: string;
  }>;
}

async function fetchTopics(
  locale: string,
  params: { tag?: string; optionSet?: string; lang?: string },
): Promise<TopicsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl)
    return { success: true, topics: [], pagination: { limit: 20, hasMore: false, nextCursor: null } };

  try {
    const qs = new URLSearchParams({ status: 'published', lang: params.lang ?? locale, limit: '20' });
    if (params.tag) qs.set('tagId', params.tag);
    if (params.optionSet) qs.set('optionSetId', params.optionSet);

    const res = await fetch(`${apiUrl}/topics?${qs.toString()}`, { cache: 'no-store' });
    if (!res.ok)
      return { success: true, topics: [], pagination: { limit: 20, hasMore: false, nextCursor: null } };
    return (await res.json()) as TopicsResponse;
  } catch {
    return { success: true, topics: [], pagination: { limit: 20, hasMore: false, nextCursor: null } };
  }
}

async function fetchTags(locale: string): Promise<Tag[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/tags?lang=${locale}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data: TagsResponse = await res.json();
    return data.tags ?? [];
  } catch {
    return [];
  }
}

async function fetchOptionSets(): Promise<OptionSet[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/option-sets`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data: OptionSetsResponse = await res.json();
    return data.optionSets ?? [];
  } catch {
    return [];
  }
}

function TopicsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
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
      ))}
    </div>
  );
}

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
  const t = await getTranslations('topics');
  const locale = await getLocale();
  const resolvedParams = await searchParams;

  // SSR data — all three fetches in parallel
  const [initialTopics, initialTags, initialOptionSets] = await Promise.all([
    fetchTopics(locale, resolvedParams),
    fetchTags(locale),
    fetchOptionSets(),
  ]);

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
            Explore
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            {t('page_title')}
          </h1>

          {/* Filter bar */}
          <Suspense fallback={<Skeleton className="h-8 w-80 rounded-full" />}>
            <TopicFilters
              initialTags={initialTags}
              initialOptionSets={initialOptionSets}
            />
          </Suspense>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-10" />

        {/* Topics grid */}
        <Suspense fallback={<TopicsListSkeleton />}>
          <TopicsList initialData={initialTopics} />
        </Suspense>
      </div>
    </section>
  );
}
