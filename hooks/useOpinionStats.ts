import { useQuery } from '@tanstack/react-query';
import { getOpinionStats } from '@/lib/api/opinions.api';

export function useOpinionStats(topicId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['opinion-stats', topicId],
    queryFn: () => getOpinionStats(topicId),
    enabled,
    staleTime: 30_000,
    select: (res) => res.data,
  });
}
