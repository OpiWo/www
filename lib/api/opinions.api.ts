import { axiosInstance as api } from '@/lib/axios';
import type { OpinionStatsResponse } from '@/types/opinions.types';

export async function getOpinionStats(topicId: string): Promise<OpinionStatsResponse> {
  const { data } = await api.get<OpinionStatsResponse>(`/topics/${topicId}/opinions/stats`);
  return data;
}
