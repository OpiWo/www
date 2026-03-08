import { useQuery } from '@tanstack/react-query';
import { listTags } from '@/lib/api/tags.api';

export function useTags(lang?: string) {
  return useQuery({
    queryKey: ['tags', { lang }],
    queryFn: () => listTags(lang),
    staleTime: 5 * 60 * 1000,
  });
}
