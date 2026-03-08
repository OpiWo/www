import { axiosInstance as api } from '@/lib/axios';
import type { OptionSetsResponse } from '@/types/option-sets.types';

export async function listOptionSets(): Promise<OptionSetsResponse> {
  const { data } = await api.get<OptionSetsResponse>('/option-sets');
  return data;
}
