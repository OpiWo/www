import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitOpinion } from '@/lib/api/opinions.api';

/**
 * Mutation for submitting or re-submitting an opinion on a topic.
 * On success: invalidates opinion-stats + user-opinion queries for that topic.
 */
export function useSubmitOpinion(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (optionValue: string) => submitOpinion(topicId, optionValue),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['opinion-stats', topicId] });
      void queryClient.invalidateQueries({ queryKey: ['user-opinion', topicId] });
    },
  });
}
