import { useQuery } from '@tanstack/react-query';
import { listOptionSets } from '@/lib/api/option-sets.api';

export function useOptionSets() {
  return useQuery({
    queryKey: ['option-sets'],
    queryFn: listOptionSets,
    staleTime: 5 * 60 * 1000,
  });
}
