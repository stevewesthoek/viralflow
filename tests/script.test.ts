import { buildScript } from '../src/script';
import { generateId, getCurrentTimestamp } from '../src/utils';

describe('Script Workflow', () => {
  const mockTopic = {
    id: generateId('topic'),
    title: 'AI Automation for Creators',
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
    angle_text: 'Stop manual editing, use AI instead',
    format: 'longform' as const,
    contrast_pair: {
      old: 'Manual editing',
      new: 'AI automation',
    },
    target_emotion: 'contrarian' as const,
    created_at: getCurrentTimestamp(),
  };

  const mockHook = {
    id: generateId('hook'),
    text: "Everyone's wasting hours on manual editing",
    pattern: 'contrarian' as const,
    score: 89,
    created_at: getCurrentTimestamp(),
  };

  describe('buildScript()', () => {
    test('creates valid script object', () => {
      const script = buildScript({
        topic: mockTopic,
        angle: mockAngle,
        hook: mockHook,
        format: 'longform',
      });

      expect(script).toBeDefined();
      expect(script.id).toBeTruthy();
      expect(script.topic_id).toBe(mockTopic.id);
      expect(script.angle_id).toBe(mockAngle.id);
      expect(script.hook_id).toBe(mockHook.id);
    });

    test('includes hook in content', () => {
      const script = buildScript({
        topic: mockTopic,
        angle: mockAngle,
        hook: mockHook,
        format: 'longform',
      });

      expect(script.content).toContain(mockHook.text);
    });

    test('replaces contrast pairs in content', () => {
      const script = buildScript({
        topic: mockTopic,
        angle: mockAngle,
        hook: mockHook,
        format: 'longform',
      });

      expect(script.content).toContain(mockAngle.contrast_pair.old);
      expect(script.content).toContain(mockAngle.contrast_pair.new);
    });

    test('generates title', () => {
      const script = buildScript({
        topic: mockTopic,
        angle: mockAngle,
        hook: mockHook,
        format: 'longform',
      });

      expect(script.title).toBeTruthy();
      expect(script.title).toContain(mockAngle.contrast_pair.new);
    });

    test('estimates duration for longform', () => {
      const script = buildScript({
        topic: mockTopic,
        angle: mockAngle,
        hook: mockHook,
        format: 'longform',
      });

      expect(script.estimated_duration).toBeCloseTo(300, -1); // ~5 minutes
    });

    test('estimates duration for shortform', () => {
      const script = buildScript({
        topic: mockTopic,
        angle: mockAngle,
        hook: mockHook,
        format: 'shortform',
      });

      expect(script.estimated_duration).toBeCloseTo(45, -1); // ~45 seconds
    });

    test('respects custom duration', () => {
      const script = buildScript({
        topic: mockTopic,
        angle: mockAngle,
        hook: mockHook,
        format: 'longform',
        duration: 120,
      });

      expect(script.estimated_duration).toBe(120);
    });

    test('throws error for unknown format', () => {
      expect(() => {
        buildScript({
          topic: mockTopic,
          angle: mockAngle,
          hook: mockHook,
          format: 'unknown' as unknown as 'longform' | 'shortform' | 'linkedin',
        });
      }).toThrow('Unknown format');
    });
  });
});
