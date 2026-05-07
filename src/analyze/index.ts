import { PerformanceMetric, AgentBrain, AnalyzeOptions } from '../types';
import { generateId, getCurrentTimestamp } from '../utils';

export async function recordPerformance(
  options: AnalyzeOptions,
  agentBrain?: AgentBrain
): Promise<PerformanceMetric> {
  const { script_id, metrics } = options;

  const hookPerformance = metrics.engagement_rate * 100;

  const metric: PerformanceMetric = {
    id: generateId('metric'),
    script_id,
    platform: metrics.platform,
    views: metrics.views,
    engagement_rate: metrics.engagement_rate,
    click_through_rate: metrics.click_through_rate,
    conversion_rate: metrics.conversion_rate,
    hook_performance: hookPerformance,
    recorded_at: getCurrentTimestamp(),
  };

  if (agentBrain) {
    agentBrain.performance_history.push(metric);
    agentBrain.last_updated = getCurrentTimestamp();
    updateLearnedPatterns(agentBrain);
  }

  return metric;
}

export function analyzePatterns(agentBrain: AgentBrain): {
  best_hook_patterns: string[];
  best_angles: string[];
  best_platforms: string[];
  audience_insights: Record<string, unknown>;
} {
  const history = agentBrain.performance_history;

  if (history.length === 0) {
    return {
      best_hook_patterns: [],
      best_angles: [],
      best_platforms: [],
      audience_insights: {},
    };
  }

  const platformStats = new Map<string, { total: number; totalEngagement: number }>();
  history.forEach((metric) => {
    const existing = platformStats.get(metric.platform) || { total: 0, totalEngagement: 0 };
    platformStats.set(metric.platform, {
      total: existing.total + metric.views,
      totalEngagement: existing.totalEngagement + metric.views * metric.engagement_rate,
    });
  });

  const platformRanked = Array.from(platformStats.entries())
    .map(([platform, stats]) => ({
      platform,
      avgEngagement: stats.totalEngagement / stats.total,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .map((item) => item.platform);

  const topPerformer = history.reduce((best, current) =>
    current.engagement_rate > best.engagement_rate ? current : best
  );

  const avgEngagement =
    history.reduce((sum, m) => sum + m.engagement_rate, 0) / history.length;

  return {
    best_hook_patterns: agentBrain.learned_patterns.best_hook_patterns,
    best_angles: agentBrain.learned_patterns.best_angles,
    best_platforms: platformRanked,
    audience_insights: {
      total_videos: history.length,
      avg_engagement_rate: avgEngagement,
      top_performer_engagement: topPerformer.engagement_rate,
      top_platform: platformRanked[0],
    },
  };
}

function updateLearnedPatterns(agentBrain: AgentBrain): void {
  const history = agentBrain.performance_history;
  if (history.length < 3) return;

  agentBrain.learned_patterns.audience_preferences = {
    prefers_long_form: history.filter((m) => m.views > 10000).length > 0,
    prefers_short_form: history.filter((m) => m.platform === 'tiktok').length > 0,
    best_engagement_time: 'evening',
    average_view_duration: '45%',
  };
}
