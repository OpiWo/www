import { useQuery } from '@tanstack/react-query';
import { listTopics } from '@/lib/api/topics.api';
import type { TopicsResponse } from '@/types/topics.types';

export function useTopics(
  params: { lang?: string; limit?: number } = {},
  initialData?: TopicsResponse,
) {
  return useQuery({
    queryKey: ['topics', params],
    queryFn: () => listTopics(params),
    initialData,
    staleTime: 60_000,
  });
}
