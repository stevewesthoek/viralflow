import { generateAngles } from '../src/angle';
import { generateId, getCurrentTimestamp } from '../src/utils';

describe('Angle Workflow', () => {
  const mockTopic = {
    id: generateId('topic'),
    title: 'AI Automation for Creators',
    keywords: ['AI', 'automation', 'creators'],
    description: 'How AI automates content creation',
    source: 'youtube' as const,
    trend_score: 85,
    competition_score: 60,
    relevance_score: 80,
    created_at: getCurrentTimestamp(),
    metadata: {},
  };

  describe('generateAngles()', () => {
    test('generates 15 angles by default', () => {
      const angles = generateAngles({ topic: mockTopic });
      expect(angles).toHaveLength(15);
    });

    test('generates angles with all formats', () => {
      const angles = generateAngles({
        topic: mockTopic,
        formats: ['longform', 'shortform', 'linkedin'],
      });

      expect(angles).toHaveLength(15);
      const formats = new Set(angles.map((a) => a.format));
      expect(formats.size).toBe(3);
    });

    test('each angle has contrast pair', () => {
      const angles = generateAngles({ topic: mockTopic });
      angles.forEach((angle) => {
        expect(angle.contrast_pair).toBeDefined();
        expect(angle.contrast_pair.old).toBeTruthy();
        expect(angle.contrast_pair.new).toBeTruthy();
      });
    });

    test('each angle has target emotion', () => {
      const angles = generateAngles({ topic: mockTopic });
      const validEmotions = ['curiosity', 'fear', 'benefit', 'contrarian', 'urgency', 'proof'];

      angles.forEach((angle) => {
        expect(validEmotions).toContain(angle.target_emotion);
      });
    });

    test('respects num_angles parameter', () => {
      const angles = generateAngles({
        topic: mockTopic,
        num_angles: 5,
      });

      expect(angles.length).toBeLessThanOrEqual(5);
    });

    test('generates contrast pairs from topic', () => {
      const angles = generateAngles({ topic: mockTopic });

      angles.forEach((angle) => {
        expect(angle.contrast_pair).toBeDefined();
        expect(angle.contrast_pair.old).toBeTruthy();
        expect(angle.contrast_pair.new).toBeTruthy();
      });
    });

    test('longform angles have proper format', () => {
      const angles = generateAngles({
        topic: mockTopic,
        formats: ['longform'],
        num_angles: 5,
      });

      angles.forEach((angle) => {
        expect(angle.format).toBe('longform');
        expect(angle.angle_text).toBeTruthy();
        expect(angle.angle_text.length).toBeGreaterThan(10);
      });
    });

    test('shortform angles have proper format', () => {
      const angles = generateAngles({
        topic: mockTopic,
        formats: ['shortform'],
        num_angles: 5,
      });

      angles.forEach((angle) => {
        expect(angle.format).toBe('shortform');
      });
    });
  });
});
