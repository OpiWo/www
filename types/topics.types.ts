export interface Topic {
  id: string;
  title: string;
  description: string;
  originalTitle: string;
  originalDescription: string;
  authorId: string;
  originalLanguage: string;
  optionSetId: string;
  status: 'pending' | 'published' | 'rejected';
  reanswerLockDays: number;
  hidden: boolean;
  tags: Array<{ id: string; name: string }>;
  publishedAt: string | null;
  createdAt: string;
}

export interface TopicsResponse {
  success: true;
  topics: Topic[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}
