import { recordPerformance, analyzePatterns } from '../src/analyze';
import { AgentBrain, PerformanceMetric } from '../src/types';
import { getCurrentTimestamp, generateId } from '../src/utils';

describe('Analyze Workflow', () => {
  const mockAgentBrain: AgentBrain = {
    icp: 'Content creators earning 6-7 figures',
    pillar_topics: ['AI automation', 'personal branding', 'monetization'],
    learned_patterns: {
      best_hook_patterns: ['contrarian', 'curiosity_gap'],
      best_angles: [],
      best_platforms: [],
      audience_preferences: {},
    },
    performance_history: [],
    last_updated: getCurrentTimestamp(),
  };

  describe('recordPerformance()', () => {
    test('creates valid performance metric', async () => {
      const metric = await recordPerformance({
        script_id: generateId('script'),
        metrics: {
          platform: 'tiktok',
          views: 10000,
          engagement_rate: 0.12,
        },
      });

      expect(metric).toBeDefined();
      expect(metric.id).toBeTruthy();
      expect(metric.views).toBe(10000);
      expect(metric.engagement_rate).toBe(0.12);
      expect(metric.platform).toBe('tiktok');
    });

    test('calculates hook performance', async () => {
      const metric = await recordPerformance({
        script_id: generateId('script'),
        metrics: {
          platform: 'tiktok',
          views: 10000,
          engagement_rate: 0.15,
        },
      });

      expect(metric.hook_performance).toBeCloseTo(15, 0);
    });

    test('adds metric to agent brain history', async () => {
      const brain: AgentBrain = { ...mockAgentBrain, performance_history: [] };
      await recordPerformance(
        {
          script_id: generateId('script'),
          metrics: {
            platform: 'youtube',
            views: 5000,
            engagement_rate: 0.08,
          },
        },
        brain
      );

      expect(brain.performance_history.length).toBe(1);
      expect(brain.last_updated).not.toBe(mockAgentBrain.last_updated);
    });

    test('handles optional metrics', async () => {
      const metric = await recordPerformance({
        script_id: generateId('script'),
        metrics: {
          platform: 'linkedin',
          views: 2000,
          engagement_rate: 0.18,
          click_through_rate: 0.05,
          conversion_rate: 0.02,
        },
      });

      expect(metric.click_through_rate).toBe(0.05);
      expect(metric.conversion_rate).toBe(0.02);
    });
  });

  describe('analyzePatterns()', () => {
    test('returns empty arrays for no history', () => {
      const patterns = analyzePatterns(mockAgentBrain);

      expect(patterns.best_hook_patterns).toEqual([]);
      expect(patterns.best_platforms).toEqual([]);
    });

    test('ranks platforms by engagement', () => {
      const brain: AgentBrain = { ...mockAgentBrain, performance_history: [] };

      // Add metrics for different platforms
      const metric1: PerformanceMetric = {
        id: generateId('metric'),
        script_id: generateId('script'),
        platform: 'tiktok',
        views: 10000,
        engagement_rate: 0.15,
        recorded_at: getCurrentTimestamp(),
      };
      brain.performance_history.push(metric1);

      const metric2: PerformanceMetric = {
        id: generateId('metric'),
        script_id: generateId('script'),
        platform: 'youtube',
        views: 5000,
        engagement_rate: 0.08,
        recorded_at: getCurrentTimestamp(),
      };
      brain.performance_history.push(metric2);

      const patterns = analyzePatterns(brain);

      expect(patterns.best_platforms[0]).toBe('tiktok');
      expect(patterns.best_platforms[1]).toBe('youtube');
    });

    test('calculates audience insights', () => {
      const brain: AgentBrain = { ...mockAgentBrain, performance_history: [] };

      const metric: PerformanceMetric = {
        id: generateId('metric'),
        script_id: generateId('script'),
        platform: 'tiktok',
        views: 10000,
        engagement_rate: 0.12,
        recorded_at: getCurrentTimestamp(),
      };
      brain.performance_history.push(metric);

      const patterns = analyzePatterns(brain);

      expect(patterns.audience_insights.total_videos).toBe(1);
      expect(patterns.audience_insights.avg_engagement_rate).toBeCloseTo(0.12, 2);
    });

    test('calculates top performer', () => {
      const brain: AgentBrain = { ...mockAgentBrain, performance_history: [] };

      const metric1: PerformanceMetric = {
        id: generateId('metric'),
        script_id: generateId('script'),
        platform: 'tiktok',
        views: 5000,
        engagement_rate: 0.10,
        recorded_at: getCurrentTimestamp(),
      };
      const metric2: PerformanceMetric = {
        id: generateId('metric'),
        script_id: generateId('script'),
        platform: 'youtube',
        views: 3000,
        engagement_rate: 0.25,
        recorded_at: getCurrentTimestamp(),
      };

      brain.performance_history.push(metric1, metric2);
      const patterns = analyzePatterns(brain);

      expect(patterns.audience_insights.top_performer_engagement).toBe(0.25);
      expect(patterns.audience_insights.top_platform).toBe('youtube');
    });

    test('updates learned patterns after 3+ metrics', async () => {
      const brain: AgentBrain = { ...mockAgentBrain, performance_history: [] };

      const script_id = generateId('script');
      for (let i = 0; i < 3; i += 1) {
        await recordPerformance(
          {
            script_id,
            metrics: {
              platform: 'youtube',
              views: 5000 + i * 1000,
              engagement_rate: 0.08 + i * 0.02,
            },
          },
          brain
        );
      }

      expect(brain.learned_patterns.audience_preferences).toBeDefined();
      expect(Object.keys(brain.learned_patterns.audience_preferences).length).toBeGreaterThan(0);
    });
  });
});
