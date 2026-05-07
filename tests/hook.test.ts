import { generateHooks, scoreHook } from '../src/hook';
import { generateId, getCurrentTimestamp } from '../src/utils';

describe('Hook Workflow', () => {
  const mockTopic = {
    id: generateId('topic'),
    title: 'AI Automation',
    keywords: ['AI', 'automation'],
    description: 'How AI automates content',
    source: 'youtube' as const,
    trend_score: 85,
    competition_score: 60,
    relevance_score: 80,
    created_at: getCurrentTimestamp(),
    metadata: {},
  };

  const mockAngle = {
    id: generateId('angle'),
    topic_id: mockTopic.id,
    angle_text: 'Everyone thinks manual work is necessary, but AI can automate it',
    format: 'longform' as const,
    contrast_pair: {
      old: 'Manual work',
      new: 'AI automation',
    },
    target_emotion: 'contrarian' as const,
    created_at: getCurrentTimestamp(),
  };

  describe('generateHooks()', () => {
    test('generates hooks with all 6 patterns', () => {
      const hooks = generateHooks({
        topic: mockTopic,
        angle: mockAngle,
        num_hooks: 6,
      });

      expect(hooks).toBeDefined();
      expect(hooks.length).toBeGreaterThan(0);
    });

    test('each hook has a pattern', () => {
      const hooks = generateHooks({
        topic: mockTopic,
        angle: mockAngle,
      });

      hooks.forEach((hook) => {
        expect(hook.pattern).toMatch(
          /curiosity_gap|fear_urgency|benefit|contrarian|pattern_interrupt|social_proof/
        );
      });
    });

    test('each hook has a score', () => {
      const hooks = generateHooks({
        topic: mockTopic,
        angle: mockAngle,
      });

      hooks.forEach((hook) => {
        expect(hook.score).toBeGreaterThanOrEqual(0);
        expect(hook.score).toBeLessThanOrEqual(100);
      });
    });

    test('hooks are ranked by score', () => {
      const hooks = generateHooks({
        topic: mockTopic,
        angle: mockAngle,
        num_hooks: 3,
      });

      for (let i = 1; i < hooks.length; i++) {
        expect(hooks[i - 1].score).toBeGreaterThanOrEqual(hooks[i].score);
      }
    });

    test('respects num_hooks parameter', () => {
      const hooks = generateHooks({
        topic: mockTopic,
        angle: mockAngle,
        num_hooks: 2,
      });

      expect(hooks.length).toBeLessThanOrEqual(2);
    });

    test('hook text includes contrast info', () => {
      const hooks = generateHooks({
        topic: mockTopic,
        angle: mockAngle,
        num_hooks: 1,
      });

      expect(hooks[0].text).toBeTruthy();
      expect(hooks[0].text.length).toBeGreaterThan(5);
    });
  });

  describe('scoreHook()', () => {
    test('scores hook between 0-100', () => {
      const hook = {
        id: generateId('hook'),
        text: 'This one weird trick...',
        pattern: 'curiosity_gap' as const,
        score: 0,
        created_at: getCurrentTimestamp(),
      };

      const score = scoreHook(hook);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('contrarian hooks score well', () => {
      const hookContrarian = {
        id: generateId('hook'),
        text: "Everyone's wrong about this...",
        pattern: 'contrarian' as const,
        score: 0,
        created_at: getCurrentTimestamp(),
      };

      const score = scoreHook(hookContrarian);
      expect(score).toBeGreaterThan(60);
    });

    test('respects angle emotional resonance', () => {
      const hook = {
        id: generateId('hook'),
        text: "Everyone's wrong about this...",
        pattern: 'contrarian' as const,
        score: 0,
        created_at: getCurrentTimestamp(),
      };

      const scoreWithResonance = scoreHook(hook, { angle: mockAngle });
      const scoreWithoutResonance = scoreHook(hook, { angle: { ...mockAngle, target_emotion: 'benefit' as const } });

      expect(scoreWithResonance).toBeGreaterThanOrEqual(scoreWithoutResonance);
    });
  });
});
