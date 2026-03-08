import { useQuery } from '@tanstack/react-query';
import { getDemographics, getHistorical } from '@/lib/api/analytics.api';

export function useDemographics(topicId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['demographics', topicId],
    queryFn: () => getDemographics(topicId),
    enabled,
    staleTime: 60_000,
    select: (res) => res.data,
  });
}

export function useHistorical(
  topicId: string,
  period: 'weekly' | 'monthly' | 'yearly',
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['historical', topicId, period],
    queryFn: () => getHistorical(topicId, period),
    enabled,
    staleTime: 60_000,
    select: (res) => res.data,
  });
}
