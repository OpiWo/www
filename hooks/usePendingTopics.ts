import { useQuery } from '@tanstack/react-query';
import { listPendingTopics } from '@/lib/api/topics.api';

export function usePendingTopics(enabled: boolean) {
  return useQuery({
    queryKey: ['pending-topics'],
    queryFn: () => listPendingTopics({ limit: 4 }),
    enabled,
    staleTime: 60_000,
  });
}
