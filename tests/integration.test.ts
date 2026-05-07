import {
  discover,
  generateAngles,
  generateHooks,
  buildScript,
  recordPerformance,
  analyzePatterns,
} from '../src';
import { AgentBrain } from '../src/types';
import { getCurrentTimestamp } from '../src/utils';

describe('End-to-End Integration', () => {
  test('complete workflow: discover → angle → hook → script → analyze', async () => {
    // Step 1: Discover trending topics
    const topics = await discover({
      sources: ['youtube'],
      keywords: ['AI automation'],
      max_results: 3,
    });

    expect(topics.length).toBeGreaterThan(0);
    const topic = topics[0];

    // Step 2: Generate angles
    const angles = generateAngles({
      topic,
      formats: ['longform', 'shortform'],
      num_angles: 6,
    });

    expect(angles.length).toBeLessThanOrEqual(6);
    const angle = angles[0];

    // Step 3: Generate hooks
    const hooks = generateHooks({
      topic,
      angle,
      num_hooks: 3,
    });

    expect(hooks.length).toBeGreaterThan(0);
    const hook = hooks[0];

    // Step 4: Build script
    const script = buildScript({
      topic,
      angle,
      hook,
      format: 'longform',
      duration: 300,
    });

    expect(script).toBeDefined();
    expect(script.content).toContain(hook.text);
    expect(script.estimated_duration).toBe(300);

    // Step 5: Record performance and analyze
    const agentBrain: AgentBrain = {
      icp: 'Content creators',
      pillar_topics: ['AI'],
      learned_patterns: {
        best_hook_patterns: [],
        best_angles: [],
        best_platforms: [],
        audience_preferences: {},
      },
      performance_history: [],
      last_updated: getCurrentTimestamp(),
    };

    const metric = await recordPerformance(
      {
        script_id: script.id,
        metrics: {
          platform: 'youtube',
          views: 15000,
          engagement_rate: 0.12,
        },
      },
      agentBrain
    );

    expect(metric).toBeDefined();
    expect(agentBrain.performance_history.length).toBe(1);

    // Step 6: Analyze patterns
    const patterns = analyzePatterns(agentBrain);
    expect(patterns.audience_insights.total_videos).toBe(1);
  });

  test('multi-video batch workflow', async () => {
    const topics = await discover({
      sources: ['youtube'],
      keywords: ['productivity'],
      max_results: 2,
    });

    const scripts = topics.map((topic) => {
      const angles = generateAngles({ topic, formats: ['shortform'], num_angles: 1 });
      const hooks = generateHooks({ topic, angle: angles[0], num_hooks: 1 });
      return buildScript({
        topic,
        angle: angles[0],
        hook: hooks[0],
        format: 'shortform',
        duration: 45,
      });
    });

    expect(scripts.length).toBe(2);
    scripts.forEach((script) => {
      expect(script.id).toBeTruthy();
      expect(script.content).toBeTruthy();
      expect(script.estimated_duration).toBe(45);
    });
  });
});
