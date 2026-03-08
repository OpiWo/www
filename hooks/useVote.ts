import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { castVote } from '@/lib/api/votes.api';

export function useVote(topicId: string) {
  const queryClient = useQueryClient();
  const [localVote, setLocalVote] = useState<'upvote' | 'downvote' | null>(null);

  const mutation = useMutation({
    mutationFn: (vote: 'upvote' | 'downvote') => castVote(topicId, vote),
    onSuccess: (data) => {
      setLocalVote(data.userVote);
      void queryClient.invalidateQueries({ queryKey: ['pending-topics'] });
    },
    onError: (error: unknown) => {
      // Silently ignore TOPIC_ALREADY_VOTED
      const err = error as { response?: { data?: { code?: string } } };
      if (err?.response?.data?.code === 'TOPIC_ALREADY_VOTED') return;
      // Other errors: rethrow for the component to handle if needed
    },
  });

  const vote = (direction: 'upvote' | 'downvote') => {
    if (mutation.isPending) return;
    mutation.mutate(direction);
  };

  return {
    vote,
    localVote,
    isPending: mutation.isPending,
    pendingDirection: mutation.variables,
  };
}
