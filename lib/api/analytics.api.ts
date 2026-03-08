import { axiosInstance as api } from '@/lib/axios';
import type { DemographicsResponse, HistoricalResponse } from '@/types/analytics.types';

export async function getDemographics(topicId: string): Promise<DemographicsResponse> {
  const { data } = await api.get<DemographicsResponse>(
    `/topics/${topicId}/analytics/demographics`,
  );
  return data;
}

export async function getHistorical(
  topicId: string,
  period: 'weekly' | 'monthly' | 'yearly' = 'weekly',
): Promise<HistoricalResponse> {
  const { data } = await api.get<HistoricalResponse>(
    `/topics/${topicId}/analytics/historical`,
    { params: { period } },
  );
  return data;
}
