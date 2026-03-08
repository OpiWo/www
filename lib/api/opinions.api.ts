import { axiosInstance as api } from '@/lib/axios';
import type {
  OpinionStatsResponse,
  SubmitOpinionResponse,
  UserOpinionsResponse,
} from '@/types/opinions.types';

export async function getOpinionStats(topicId: string): Promise<OpinionStatsResponse> {
  const { data } = await api.get<OpinionStatsResponse>(`/topics/${topicId}/opinions/stats`);
  return data;
}

export async function submitOpinion(
  topicId: string,
  optionValue: string,
): Promise<SubmitOpinionResponse> {
  const { data } = await api.post<SubmitOpinionResponse>(`/topics/${topicId}/opinions`, {
    option_value: optionValue,
  });
  return data;
}

export async function getUserTopicOpinion(topicId: string): Promise<UserOpinionsResponse> {
  const { data } = await api.get<UserOpinionsResponse>('/opinions', {
    params: { topicId, limit: 1 },
  });
  return data;
}
