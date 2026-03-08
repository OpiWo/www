import { axiosInstance as api } from '@/lib/axios';
import type { TopicsResponse, TopicDetailResponse } from '@/types/topics.types';

interface ListTopicsParams {
  lang?: string;
  limit?: number;
  cursor?: string;
  tagId?: string;
  optionSetId?: string;
}

export async function listTopics(params: ListTopicsParams = {}): Promise<TopicsResponse> {
  const { data } = await api.get<TopicsResponse>('/topics', {
    params: { status: 'published', ...params },
  });
  return data;
}

export async function getTopic(id: string, lang?: string): Promise<TopicDetailResponse> {
  const { data } = await api.get<TopicDetailResponse>(`/topics/${id}`, {
    params: lang ? { lang } : undefined,
  });
  return data;
}
