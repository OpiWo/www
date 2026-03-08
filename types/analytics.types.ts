export interface DemographicBucket {
  count: number;
  percentage: number;
}

export interface OptionDemographics {
  count: number;
  percentage: number;
  demographics: {
    by_gender: Record<string, DemographicBucket>;
    by_country: Record<string, DemographicBucket>;
    by_age_range: Record<string, DemographicBucket>;
  };
}

export interface DemographicsData {
  topic_id: string;
  total: number;
  breakdown: Record<string, OptionDemographics>;
}

export interface DemographicsResponse {
  success: true;
  data: DemographicsData;
}

export interface HistoricalDataPoint {
  period: string;
  total: number;
  breakdown: Record<string, { count: number; percentage: number }>;
}

export interface HistoricalData {
  topic_id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  data: HistoricalDataPoint[];
}

export interface HistoricalResponse {
  success: true;
  data: HistoricalData;
}
