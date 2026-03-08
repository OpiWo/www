import { axiosInstance as api } from '@/lib/axios';
import type { VoteResponse } from '@/types/topics.types';

export async function castVote(
  topicId: string,
  vote: 'upvote' | 'downvote',
): Promise<VoteResponse> {
  const { data } = await api.post<VoteResponse>(`/topics/${topicId}/votes`, { vote });
  return data;
}
