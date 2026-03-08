import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { TopicDetailHeader } from '@/components/www/topics/TopicDetailHeader';
import { OptionsResultsChart } from '@/components/www/topics/OptionsResultsChart';
import { DemographicsPanel } from '@/components/www/topics/DemographicsPanel';
import { HistoricalChart } from '@/components/www/topics/HistoricalChart';
import type { TopicDetail } from '@/types/topics.types';
import type { Metadata } from 'next';

export const revalidate = 30;

interface TopicPageProps {
  params: Promise<{ id: string; locale: string }>;
}

async function fetchTopicDetail(id: string, lang: string): Promise<TopicDetail | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/topics/${id}?lang=${lang}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || json.code === 'TOPIC_NOT_FOUND') return null;
    return json.topic as TopicDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const topic = await fetchTopicDetail(id, locale);
  if (!topic) return { title: 'Topic not found' };

  return {
    title: `${topic.title} — OpiWo`,
    description: topic.description,
    openGraph: {
      title: topic.title,
      description: topic.description,
      type: 'article',
    },
  };
}

function TopicPageSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-24 mb-8" />
        <div className="mb-1 h-0.5 w-12 bg-muted" />
        <Skeleton className="h-4 w-48 mb-4 mt-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full max-w-xl mb-2" />
        <Skeleton className="h-4 w-2/3 mb-8" />
        <Skeleton className="h-64 w-full rounded-2xl mb-6" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </section>
  );
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { id, locale } = await params;
  const [topic, t] = await Promise.all([
    fetchTopicDetail(id, locale),
    getTranslations('topic_detail'),
  ]);

  if (!topic || topic.hidden || topic.status !== 'published') {
    notFound();
  }

  return (
    <section className="py-10 md:py-16 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-10">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {t('back_to_topics')}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <TopicDetailHeader topic={topic} />
        </div>

        {/* Results chart — full width */}
        <div className="mb-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-border bg-card p-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-7 w-full rounded-md" />
                  ))}
                </div>
              </div>
            }
          >
            <OptionsResultsChart topic={topic} />
          </Suspense>
        </div>

        {/* Analytics tabs */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <Tabs defaultValue="demographics">
            <div className="border-b border-border px-6 pt-5 pb-0">
              <TabsList className="mb-0 -mb-px h-auto bg-transparent p-0 gap-0">
                <TabsTrigger
                  value="demographics"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 pt-0 px-4 text-sm"
                >
                  {t('tab_demographics')}
                </TabsTrigger>
                <TabsTrigger
                  value="trend"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 pt-0 px-4 text-sm"
                >
                  {t('tab_trend')}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="demographics" className="mt-0">
                <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
                  <DemographicsPanel topic={topic} />
                </Suspense>
              </TabsContent>

              <TabsContent value="trend" className="mt-0">
                <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
                  <HistoricalChart topic={topic} />
                </Suspense>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
