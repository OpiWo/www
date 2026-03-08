'use client';

import { useAuth } from '@/hooks/use-auth';
import { useOpinionStats } from '@/hooks/useOpinionStats';
import { useTransitions } from '@/hooks/useTransitions';
import { KpiStrip } from './KpiStrip';
import { ResultsChartCard } from './ResultsChartCard';
import { TrendChartCard } from './TrendChartCard';
import { DemographicsSection } from './DemographicsSection';
import { OpinionFlowCard } from './OpinionFlowCard';
import type { TopicDetail } from '@/types/topics.types';

interface TopicAnalyticsDashboardProps {
  topic: TopicDetail;
}

export function TopicAnalyticsDashboard({ topic }: TopicAnalyticsDashboardProps) {
  const { user } = useAuth();
  const isAuth = !!user;

  const { data: stats } = useOpinionStats(topic.id, true);
  const { data: transitionsData } = useTransitions(topic.id, isAuth);

  return (
    <div className="space-y-6">
      {stats && (
        <KpiStrip stats={stats} transitions={transitionsData} isAuth={isAuth} />
      )}
      <ResultsChartCard topic={topic} />
      <TrendChartCard topic={topic} isAuth={isAuth} />
      <DemographicsSection topic={topic} isAuth={isAuth} />
      <OpinionFlowCard topic={topic} isAuth={isAuth} />
    </div>
  );
}
