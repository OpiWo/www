import { useQuery } from '@tanstack/react-query';
import { getUserTopicOpinion } from '@/lib/api/opinions.api';
import type { UserOpinion } from '@/types/opinions.types';

/**
 * Fetches the user's current opinion for a topic.
 * Only enabled when the user is authenticated.
 * Returns the isCurrent=true item or null.
 */
export function useUserOpinion(
  topicId: string,
  enabled: boolean,
): {
  data: UserOpinion | null | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const query = useQuery({
    queryKey: ['user-opinion', topicId],
    queryFn: () => getUserTopicOpinion(topicId),
    enabled,
    staleTime: 30_000,
    select: (res) => res.data.items.find((item) => item.isCurrent) ?? null,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
