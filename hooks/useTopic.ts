import { useQuery } from '@tanstack/react-query';
import { getTopic } from '@/lib/api/topics.api';
import type { TopicDetail } from '@/types/topics.types';

export function useTopic(id: string, lang?: string, initialData?: TopicDetail) {
  return useQuery({
    queryKey: ['topic', id, lang],
    queryFn: async () => {
      const res = await getTopic(id, lang);
      return res.topic;
    },
    initialData,
    staleTime: 30_000,
  });
}
