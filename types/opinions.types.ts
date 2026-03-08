export interface OpinionStatOption {
  optionValue: string;
  count: number;
  percentage: number;
}

export interface OpinionStats {
  topicId: string;
  total: number;
  options: OpinionStatOption[];
}

export interface OpinionStatsResponse {
  success: true;
  data: OpinionStats;
}

// User opinion types
export interface UserOpinion {
  id: string;
  topicId: string;
  optionValue: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface UserOpinionsPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface UserOpinionsResponse {
  success: true;
  data: {
    items: UserOpinion[];
    pagination: UserOpinionsPagination;
  };
}

export interface SubmitOpinionResponse {
  success: true;
  data: UserOpinion;
}
