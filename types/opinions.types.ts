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
