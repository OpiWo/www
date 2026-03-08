import { axiosInstance as api } from '@/lib/axios';
import type { TagsResponse } from '@/types/tags.types';

export async function listTags(lang?: string): Promise<TagsResponse> {
  const { data } = await api.get<TagsResponse>('/tags', {
    params: lang ? { lang } : undefined,
  });
  return data;
}
