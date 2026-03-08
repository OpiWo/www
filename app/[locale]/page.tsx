import { getLocale } from 'next-intl/server';
import { HeroSection } from '@/components/www/home/HeroSection';
import { StatsBanner } from '@/components/www/home/StatsBanner';
import { TrendingTopics } from '@/components/www/home/TrendingTopics';
import type { Topic, TopicsResponse } from '@/types/topics.types';

export const revalidate = 60;

async function fetchTrendingTopics(locale: string): Promise<Topic[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(
      `${apiUrl}/topics?status=published&lang=${locale}&limit=6`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data: TopicsResponse = await res.json();
    return data.topics ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const locale = await getLocale();
  const initialTopics = await fetchTrendingTopics(locale);

  return (
    <>
      <HeroSection />
      <StatsBanner />
      <TrendingTopics initialTopics={initialTopics} />
    </>
  );
}
