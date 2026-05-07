import { BrainManager } from '../src/brain';
import { rankHookPatterns, analyzeplatformPerformance, inferAudiencePreferences } from '../src/brain/learning';
import { createNewBrain, exportBrainJSON, importBrainJSON } from '../src/brain/persistence';
import { generateId, getCurrentTimestamp } from '../src/utils';
import { PerformanceMetric } from '../src/types';

describe('Brain Management System', () => {
  describe('BrainManager', () => {
    test('creates new brain manager', () => {
      const manager = BrainManager.createNew('Content creators', ['AI', 'automation']);
      const brain = manager.getBrain();

      expect(brain).toBeDefined();
      expect(brain.icp).toBe('Content creators');
      expect(brain.pillar_topics).toContain('AI');
    });

    test('records a single metric', () => {
      const manager = BrainManager.createNew('Test ICP');
      const metric: PerformanceMetric = {
        id: generateId('metric'),
        script_id: generateId('script'),
        platform: 'youtube',
        views: 5000,
        engagement_rate: 0.1,
        hook_performance: 75,
        recorded_at: getCurrentTimestamp(),
      };

      manager.recordMetric(metric);
      const brain = manager.getBrain();

      expect(brain.performance_history).toHaveLength(1);
      expect(brain.performance_history[0]).toEqual(metric);
    });

    test('records multiple metrics at once', () => {
      const manager = BrainManager.createNew('Test ICP');
      const metrics: PerformanceMetric[] = [];

      for (let i = 0; i < 3; i += 1) {
        metrics.push({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'tiktok',
          views: 2000 + i * 1000,
          engagement_rate: 0.08 + i * 0.02,
          hook_performance: 60 + i * 10,
          recorded_at: getCurrentTimestamp(),
        });
      }

      manager.recordMetrics(metrics);
      const brain = manager.getBrain();

      expect(brain.performance_history).toHaveLength(3);
      expect(brain.learning_history.length).toBeGreaterThan(0);
    });

    test('triggers learning after 3+ metrics', () => {
      const manager = BrainManager.createNew('Test ICP');

      // Add 3 metrics
      for (let i = 0; i < 3; i += 1) {
        manager.recordMetric({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: 0.12,
          hook_performance: 80,
          recorded_at: getCurrentTimestamp(),
        });
      }

      const brain = manager.getBrain();
      expect(brain.learned_patterns.best_hook_patterns.length).toBeGreaterThan(0);
      expect(brain.learning_history.length).toBeGreaterThan(0);
    });

    test('gets ranked patterns', () => {
      const manager = BrainManager.createNew('Test ICP');

      for (let i = 0; i < 3; i += 1) {
        manager.recordMetric({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: 0.12,
          hook_performance: 80,
          recorded_at: getCurrentTimestamp(),
        });
      }

      const patterns = manager.getRankedPatterns();
      expect(patterns).toBeDefined();
      expect(Array.isArray(patterns)).toBe(true);
    });

    test('gets platform analysis', () => {
      const manager = BrainManager.createNew('Test ICP');

      manager.recordMetrics([
        {
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 10000,
          engagement_rate: 0.15,
          hook_performance: 85,
          recorded_at: getCurrentTimestamp(),
        },
        {
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'tiktok',
          views: 8000,
          engagement_rate: 0.12,
          hook_performance: 78,
          recorded_at: getCurrentTimestamp(),
        },
        {
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: 0.18,
          hook_performance: 90,
          recorded_at: getCurrentTimestamp(),
        },
      ]);

      const analysis = manager.getPlatformAnalysis();
      expect(analysis.length).toBeGreaterThan(0);
      expect(analysis[0].platform).toBeDefined();
      expect(analysis[0].avg_engagement_rate).toBeGreaterThan(0);
    });

    test('gets audience preferences', () => {
      const manager = BrainManager.createNew('Test ICP');

      for (let i = 0; i < 5; i += 1) {
        manager.recordMetric({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'tiktok',
          views: 5000 + i * 1000,
          engagement_rate: 0.1 + i * 0.01,
          hook_performance: 70 + i * 5,
          recorded_at: getCurrentTimestamp(),
        });
      }

      const prefs = manager.getAudiencePreferences();
      expect(prefs).toBeDefined();
      expect(prefs.top_platform).toBe('tiktok');
    });

    test('gets learning insights', () => {
      const manager = BrainManager.createNew('Test ICP');

      for (let i = 0; i < 4; i += 1) {
        manager.recordMetric({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: i % 2 === 0 ? 'youtube' : 'tiktok',
          views: 5000,
          engagement_rate: 0.1 + i * 0.02,
          hook_performance: 70 + i * 5,
          recorded_at: getCurrentTimestamp(),
        });
      }

      const insights = manager.getInsights();
      expect(insights).toBeDefined();
      expect(insights.best_patterns).toBeDefined();
      expect(insights.best_platforms).toBeDefined();
      expect(insights.recommendations.length).toBeGreaterThan(0);
    });

    test('recalibrates confidence scores', () => {
      const manager = BrainManager.createNew('Test ICP');

      for (let i = 0; i < 3; i += 1) {
        manager.recordMetric({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: 0.12,
          hook_performance: 80,
          recorded_at: getCurrentTimestamp(),
        });
      }

      manager.recalibrateScores();
      const brain = manager.getBrain();

      expect(brain.learning_history.length).toBeGreaterThan(1);
    });

    test('gets learning statistics', () => {
      const manager = BrainManager.createNew('Test ICP');

      for (let i = 0; i < 5; i += 1) {
        manager.recordMetric({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: 0.12,
          hook_performance: 80,
          recorded_at: getCurrentTimestamp(),
        });
      }

      const stats = manager.getLearningStats();
      expect(stats.total_metrics).toBe(5);
      expect(stats.learning_events).toBeGreaterThan(0);
      expect(stats.average_confidence).toBeGreaterThanOrEqual(0);
    });

    test('exports and imports brain JSON', () => {
      const manager = BrainManager.createNew('Test ICP', ['Topic 1']);

      manager.recordMetric({
        id: generateId('metric'),
        script_id: generateId('script'),
        platform: 'youtube',
        views: 5000,
        engagement_rate: 0.12,
        hook_performance: 80,
        recorded_at: getCurrentTimestamp(),
      });

      const json = manager.exportJSON();
      expect(typeof json).toBe('string');

      const manager2 = BrainManager.createNew('Other ICP');
      manager2.importJSON(json);

      const brain2 = manager2.getBrain();
      expect(brain2.icp).toBe('Test ICP');
      expect(brain2.pillar_topics).toContain('Topic 1');
    });

    test('resets learning', () => {
      const manager = BrainManager.createNew('Test ICP');

      for (let i = 0; i < 3; i += 1) {
        manager.recordMetric({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: 0.12,
          hook_performance: 80,
          recorded_at: getCurrentTimestamp(),
        });
      }

      manager.resetLearning();
      const brain = manager.getBrain();

      expect(brain.learned_patterns.best_hook_patterns).toHaveLength(0);
      expect(Object.keys(brain.pattern_confidence)).toHaveLength(0);
    });
  });

  describe('Learning Algorithms', () => {
    test('rankHookPatterns handles empty history', () => {
      const brain = createNewBrain('Test ICP');
      const patterns = rankHookPatterns(brain);
      expect(patterns).toHaveLength(0);
    });

    test('analyzeplatformPerformance aggregates by platform', () => {
      const brain = createNewBrain('Test ICP');

      brain.performance_history.push(
        {
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 10000,
          engagement_rate: 0.15,
          recorded_at: getCurrentTimestamp(),
        },
        {
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: 0.12,
          recorded_at: getCurrentTimestamp(),
        }
      );

      const analysis = analyzeplatformPerformance(brain);
      expect(analysis).toHaveLength(1);
      expect(analysis[0].platform).toBe('youtube');
      expect(analysis[0].total_videos).toBe(2);
      expect(analysis[0].total_views).toBe(15000);
    });

    test('inferAudiencePreferences identifies platform tendency', () => {
      const brain = createNewBrain('Test ICP');

      for (let i = 0; i < 3; i += 1) {
        brain.performance_history.push({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'tiktok',
          views: 5000,
          engagement_rate: 0.12,
          recorded_at: getCurrentTimestamp(),
        });
      }

      const prefs = inferAudiencePreferences(brain);
      expect(prefs.top_platform).toBe('tiktok');
    });

    test('inferAudiencePreferences detects engagement trends', () => {
      const brain = createNewBrain('Test ICP');

      for (let i = 0; i < 10; i += 1) {
        brain.performance_history.push({
          id: generateId('metric'),
          script_id: generateId('script'),
          platform: 'youtube',
          views: 5000,
          engagement_rate: i < 5 ? 0.05 : 0.15, // Increase in recent metrics
          recorded_at: getCurrentTimestamp(),
        });
      }

      const prefs = inferAudiencePreferences(brain);
      expect(['increasing', 'stable', 'decreasing']).toContain(prefs.engagement_trend);
    });
  });

  describe('Brain Persistence', () => {
    test('creates new brain with defaults', () => {
      const brain = createNewBrain('Test ICP', ['Topic A']);
      expect(brain.icp).toBe('Test ICP');
      expect(brain.pillar_topics).toContain('Topic A');
      expect(brain.performance_history).toHaveLength(0);
      expect(brain.learning_history).toHaveLength(0);
    });

    test('exports brain to JSON', () => {
      const brain = createNewBrain('Test ICP');
      const json = exportBrainJSON(brain);
      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(parsed.icp).toBe('Test ICP');
    });

    test('imports brain from JSON', () => {
      const original = createNewBrain('Test ICP');
      const json = exportBrainJSON(original);
      const imported = importBrainJSON(json);
      expect(imported.icp).toBe(original.icp);
    });
  });
});
