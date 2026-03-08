import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { TopicDetailHeader } from '@/components/www/topics/TopicDetailHeader';
import { OpinionForm } from '@/components/www/topics/OpinionForm';
import { TopicAnalyticsDashboard } from '@/components/www/topics/TopicAnalyticsDashboard';
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      {/* Chart cards */}
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
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
    <section className="py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {t('back_to_topics')}
          </Link>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[38%_60%] gap-8 lg:gap-12 items-start">

          {/* LEFT — sticky panel */}
          <div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-112px)] lg:overflow-y-auto">
            <TopicDetailHeader topic={topic} />
            <div className="mt-8">
              <OpinionForm topic={topic} />
            </div>
            {/* Live data pill */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('response_pill_label')}
            </div>
          </div>

          {/* RIGHT — analytics dashboard */}
          <div>
            <Suspense fallback={<DashboardSkeleton />}>
              <TopicAnalyticsDashboard topic={topic} />
            </Suspense>
          </div>

        </div>
      </div>
    </section>
  );
}
