import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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

export function useTopicsInfinite(
  params: { lang?: string; limit?: number; tagId?: string; optionSetId?: string },
  initialData?: TopicsResponse,
) {
  return useInfiniteQuery({
    queryKey: ['topics-infinite', params],
    queryFn: ({ pageParam }) =>
      listTopics({ ...params, cursor: pageParam ?? undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.pagination.hasMore ? (last.pagination.nextCursor ?? undefined) : undefined,
    initialData: initialData
      ? { pages: [initialData], pageParams: [undefined] }
      : undefined,
    staleTime: 60_000,
  });
}
