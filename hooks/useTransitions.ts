import { useQuery } from '@tanstack/react-query';
import { axiosInstance as api } from '@/lib/axios';

export interface TransitionRow {
  from: string | null;
  to: string;
  count: number;
}

export interface TransitionsData {
  transitions: TransitionRow[];
}

interface TransitionsResponse {
  success: true;
  data: TransitionsData;
}

async function getTransitions(topicId: string): Promise<TransitionsResponse> {
  const { data } = await api.get<TransitionsResponse>(
    `/topics/${topicId}/analytics/transitions`,
  );
  return data;
}

export function useTransitions(topicId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['transitions', topicId],
    queryFn: () => getTransitions(topicId),
    enabled,
    staleTime: 60_000,
    select: (res) => res.data,
  });
}
