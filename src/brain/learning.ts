import { AdvancedAgentBrain, LearnedHookPattern, PlatformPerformance, LearningEvent, LearnedInsights } from './types';
import { PerformanceMetric } from '../types';
import { getCurrentTimestamp } from '../utils';

/**
 * Learning algorithms for pattern recognition and optimization
 */

const MIN_SAMPLES_FOR_LEARNING = 3;
const CONFIDENCE_DECAY_RATE = 0.95; // Old data becomes 95% as confident
const CONFIDENCE_THRESHOLD = 0.6;

/**
 * Calculate average performance for a hook pattern
 */
export function calculatePatternPerformance(
  brain: AdvancedAgentBrain,
  _pattern?: string
): { avgPerformance: number; sampleSize: number } {
  const metrics = brain.performance_history.filter((m) => m.hook_performance !== undefined && m.hook_performance > 0);

  if (metrics.length === 0) {
    return { avgPerformance: 0, sampleSize: 0 };
  }

  // For now, use hook_performance as proxy
  // In real implementation, would map hook pattern to metrics
  const avgPerformance = metrics.reduce((sum, m) => sum + (m.hook_performance || 0), 0) / metrics.length;

  return { avgPerformance: Math.min(100, Math.max(0, avgPerformance)), sampleSize: metrics.length };
}

/**
 * Rank hook patterns by performance
 */
export function rankHookPatterns(brain: AdvancedAgentBrain): LearnedHookPattern[] {
  const patterns = ['curiosity_gap', 'fear_urgency', 'benefit', 'contrarian', 'pattern_interrupt', 'social_proof'];

  const ranked = patterns
    .map((pattern) => {
      const { avgPerformance, sampleSize } = calculatePatternPerformance(brain, pattern);

      // Confidence is based on sample size (more data = higher confidence)
      const confidence = Math.min(1, sampleSize / 10); // Full confidence at 10+ samples

      return {
        pattern,
        total_uses: sampleSize,
        total_engagement: avgPerformance * sampleSize,
        avg_performance: avgPerformance,
        confidence,
        updated_at: getCurrentTimestamp(),
      };
    })
    .filter((p) => p.confidence >= CONFIDENCE_THRESHOLD || p.total_uses >= MIN_SAMPLES_FOR_LEARNING)
    .sort((a, b) => b.avg_performance - a.avg_performance);

  return ranked;
}

/**
 * Calculate platform performance statistics
 */
export function analyzeplatformPerformance(brain: AdvancedAgentBrain): PlatformPerformance[] {
  const platformMap = new Map<string, { metrics: PerformanceMetric[]; totalEngagement: number }>();

  brain.performance_history.forEach((metric) => {
    if (!platformMap.has(metric.platform)) {
      platformMap.set(metric.platform, { metrics: [], totalEngagement: 0 });
    }

    const entry = platformMap.get(metric.platform)!;
    entry.metrics.push(metric);
    entry.totalEngagement += metric.engagement_rate * metric.views;
  });

  const platforms: PlatformPerformance[] = Array.from(platformMap.entries())
    .map(([platform, data]) => {
      const avgEngagement = data.metrics.reduce((sum, m) => sum + m.engagement_rate, 0) / data.metrics.length;
      const avgCtr = data.metrics.reduce((sum, m) => sum + (m.click_through_rate || 0), 0) / data.metrics.length;
      const avgConversion = data.metrics.reduce((sum, m) => sum + (m.conversion_rate || 0), 0) / data.metrics.length;

      return {
        platform,
        total_videos: data.metrics.length,
        total_views: data.metrics.reduce((sum, m) => sum + m.views, 0),
        avg_engagement_rate: avgEngagement,
        avg_ctr: avgCtr,
        avg_conversion_rate: avgConversion,
        confidence: Math.min(1, data.metrics.length / 5),
        last_updated: getCurrentTimestamp(),
      };
    })
    .sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate);

  return platforms;
}

/**
 * Infer audience preferences from performance data
 */
export function inferAudiencePreferences(brain: AdvancedAgentBrain): Record<string, unknown> {
  const metrics = brain.performance_history;

  if (metrics.length === 0) {
    return {};
  }

  // Group by platform
  const platformCounts: Record<string, number> = {};
  metrics.forEach((m) => {
    platformCounts[m.platform] = (platformCounts[m.platform] || 0) + 1;
  });

  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Analyze engagement trends
  const avgEngagement = metrics.reduce((sum, m) => sum + m.engagement_rate, 0) / metrics.length;
  const recentMetrics = metrics.slice(-5);
  const recentAvgEngagement = recentMetrics.reduce((sum, m) => sum + m.engagement_rate, 0) / recentMetrics.length;

  const engagementTrend =
    recentAvgEngagement > avgEngagement * 1.1 ? 'increasing' : recentAvgEngagement < avgEngagement * 0.9 ? 'decreasing' : 'stable';

  return {
    top_platform: topPlatform,
    avg_engagement: avgEngagement,
    recent_engagement: recentAvgEngagement,
    engagement_trend: engagementTrend,
    total_videos: metrics.length,
    total_views: metrics.reduce((sum, m) => sum + m.views, 0),
    avg_ctr: metrics.reduce((sum, m) => sum + (m.click_through_rate || 0), 0) / metrics.length,
  };
}

/**
 * Update brain with learned patterns
 */
export function updateLearnedPatterns(brain: AdvancedAgentBrain): void {
  if (brain.performance_history.length < MIN_SAMPLES_FOR_LEARNING) {
    return;
  }

  // Rank hook patterns
  const rankedPatterns = rankHookPatterns(brain);
  brain.learned_patterns.best_hook_patterns = rankedPatterns.map((p) => p.pattern);

  // Update platform performance
  const platformPerformance = analyzeplatformPerformance(brain);
  brain.platform_performance = platformPerformance;
  brain.learned_patterns.best_platforms = platformPerformance.map((p) => p.platform);

  // Update pattern confidence
  rankedPatterns.forEach((p) => {
    brain.pattern_confidence[p.pattern] = p.confidence;
  });

  // Infer audience preferences
  brain.learned_patterns.audience_preferences = inferAudiencePreferences(brain);

  // Record learning event
  const event: LearningEvent = {
    timestamp: getCurrentTimestamp(),
    event_type: 'pattern_ranked',
    details: {
      patterns_ranked: rankedPatterns.length,
      metrics_processed: brain.performance_history.length,
      confidence_threshold: CONFIDENCE_THRESHOLD,
    },
  };
  brain.learning_history.push(event);

  // Update metadata
  brain.learning_metadata.total_metrics_processed = brain.performance_history.length;
  brain.learning_metadata.last_recalibration = getCurrentTimestamp();
}

/**
 * Generate learning insights from brain state
 */
export function getLearnedInsights(brain: AdvancedAgentBrain): LearnedInsights {
  const patterns = rankHookPatterns(brain);
  const platforms = analyzeplatformPerformance(brain);
  const preferences = inferAudiencePreferences(brain);

  // Infer content format preference
  const engagementTrend = (preferences.engagement_trend as string) || 'stable';

  const recommendations: string[] = [];

  if (patterns.length > 0) {
    recommendations.push(`Focus on ${patterns[0].pattern} hooks (${patterns[0].avg_performance.toFixed(1)}% avg performance)`);
  }

  if (platforms.length > 0) {
    recommendations.push(`YouTube has highest engagement (${(platforms[0].avg_engagement_rate * 100).toFixed(1)}%)`);
  }

  if (engagementTrend === 'increasing') {
    recommendations.push('Engagement is trending up - continue current strategy');
  } else if (engagementTrend === 'decreasing') {
    recommendations.push('Engagement is declining - consider testing new angles or platforms');
  }

  return {
    best_patterns: patterns,
    best_platforms: platforms,
    audience_profile: {
      prefers_longform: Math.random() > 0.5, // Placeholder
      prefers_shortform: Math.random() > 0.5, // Placeholder
      platform_tendency: (preferences.top_platform as string) || 'unknown',
      engagement_trend: engagementTrend as 'increasing' | 'stable' | 'decreasing',
    },
    recommendations,
  };
}

/**
 * Recalibrate pattern confidence scores based on age
 */
export function recalibrateConfidence(brain: AdvancedAgentBrain): void {
  const now = new Date().getTime();

  Object.entries(brain.pattern_confidence).forEach(([pattern, originalConfidence]) => {
    const learningEvent = brain.learning_history.find((e) => e.event_type === 'pattern_ranked');
    if (!learningEvent) return;

    const eventAge = now - new Date(learningEvent.timestamp).getTime();
    const ageInDays = eventAge / (1000 * 60 * 60 * 24);
    const decayFactor = Math.pow(CONFIDENCE_DECAY_RATE, ageInDays);

    brain.pattern_confidence[pattern] = originalConfidence * decayFactor;
  });

  const event: LearningEvent = {
    timestamp: getCurrentTimestamp(),
    event_type: 'confidence_adjusted',
    details: {
      patterns_adjusted: Object.keys(brain.pattern_confidence).length,
      decay_rate: CONFIDENCE_DECAY_RATE,
    },
  };
  brain.learning_history.push(event);
}
