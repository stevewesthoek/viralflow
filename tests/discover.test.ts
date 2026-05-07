import { discover, CustomSource } from '../src/discover';
import { generateId } from '../src/utils';

describe('Discovery Workflow', () => {
  describe('discover()', () => {
    test('discovers topics from YouTube source', async () => {
      const topics = await discover({
        sources: ['youtube'],
        keywords: ['AI'],
        max_results: 5,
      });

      expect(topics).toBeDefined();
      expect(topics.length).toBeGreaterThan(0);
      expect(topics[0]).toHaveProperty('title');
      expect(topics[0]).toHaveProperty('trend_score');
    });

    test('discovers topics from Reddit source', async () => {
      const topics = await discover({
        sources: ['reddit'],
        keywords: ['content creation'],
        max_results: 5,
      });

      expect(topics).toBeDefined();
      expect(topics.length).toBeGreaterThan(0);
    });

    test('discovers topics from multiple sources', async () => {
      const topics = await discover({
        sources: ['youtube', 'reddit'],
        keywords: ['marketing'],
        max_results: 10,
      });

      expect(topics).toBeDefined();
      expect(topics.length).toBeGreaterThanOrEqual(0);
    });

    test('respects max_results limit', async () => {
      const topics = await discover({
        sources: ['youtube'],
        keywords: ['AI'],
        max_results: 3,
      });

      expect(topics.length).toBeLessThanOrEqual(3);
    });

    test('returns ranked topics', async () => {
      const topics = await discover({
        sources: ['youtube'],
        keywords: ['AI'],
        max_results: 5,
      });

      expect(topics.length).toBeGreaterThan(0);
      expect(topics[0].trend_score).toBeGreaterThanOrEqual(0);
      expect(topics[0].trend_score).toBeLessThanOrEqual(100);
    });

    test('throws error when no sources specified', async () => {
      await expect(
        discover({
          sources: [],
          keywords: ['AI'],
        })
      ).rejects.toThrow('At least one discovery source must be specified');
    });

    test('throws error when no keywords specified', async () => {
      await expect(
        discover({
          sources: ['youtube'],
          keywords: [],
        })
      ).rejects.toThrow('At least one keyword must be specified');
    });
  });

  describe('CustomSource', () => {
    test('stores and retrieves custom topics', async () => {
      const source = new CustomSource();
      const topic = {
        id: generateId('topic'),
        title: 'Custom Topic',
        keywords: ['test'],
        description: 'A test topic',
        source: 'custom' as const,
        trend_score: 85,
        competition_score: 50,
        relevance_score: 90,
        created_at: new Date().toISOString(),
        metadata: {},
      };

      source.addTopic(topic);
      const topics = await source.discover([]);
      expect(topics).toContainEqual(topic);
    });

    test('clears topics', async () => {
      const source = new CustomSource();
      const topic = {
        id: generateId('topic'),
        title: 'Custom Topic',
        keywords: ['test'],
        description: 'A test topic',
        source: 'custom' as const,
        trend_score: 85,
        competition_score: 50,
        relevance_score: 90,
        created_at: new Date().toISOString(),
        metadata: {},
      };

      source.addTopic(topic);
      source.clear();
      const topics = await source.discover([]);
      expect(topics).toHaveLength(0);
    });

    test('adds multiple topics', async () => {
      const source = new CustomSource();
      const topic1 = {
        id: generateId('topic'),
        title: 'Topic 1',
        keywords: ['test'],
        description: 'Test 1',
        source: 'custom' as const,
        trend_score: 85,
        competition_score: 50,
        relevance_score: 90,
        created_at: new Date().toISOString(),
        metadata: {},
      };
      const topic2 = {
        id: generateId('topic'),
        title: 'Topic 2',
        keywords: ['test'],
        description: 'Test 2',
        source: 'custom' as const,
        trend_score: 80,
        competition_score: 55,
        relevance_score: 85,
        created_at: new Date().toISOString(),
        metadata: {},
      };

      source.addTopics([topic1, topic2]);
      const topics = await source.discover([]);
      expect(topics).toHaveLength(2);
    });

    test('getAll returns all topics', async () => {
      const source = new CustomSource();
      const topic = {
        id: generateId('topic'),
        title: 'Custom Topic',
        keywords: ['test'],
        description: 'A test topic',
        source: 'custom' as const,
        trend_score: 85,
        competition_score: 50,
        relevance_score: 90,
        created_at: new Date().toISOString(),
        metadata: {},
      };

      source.addTopic(topic);
      const all = source.getAll();
      expect(all).toHaveLength(1);
      expect(all[0]).toEqual(topic);
    });
  });
});
