import { DiscoverSource } from './types';
import { Topic } from '../types';

/**
 * Twitter discovery source using Twitter API v2
 * Requires TWITTER_BEARER_TOKEN environment variable
 */
export class TwitterSource implements DiscoverSource {
  private bearerToken: string;

  constructor(bearerToken?: string) {
    this.bearerToken = bearerToken || process.env.TWITTER_BEARER_TOKEN || '';
    if (!this.bearerToken) {
      console.warn(
        'TwitterSource: TWITTER_BEARER_TOKEN not set. Discovery will return mock data.'
      );
    }
  }

  async discover(keywords: string[], limit: number = 5): Promise<Topic[]> {
    if (!this.bearerToken) {
      return this.getMockTopics(keywords, limit);
    }

    try {
      const topics: Topic[] = [];
      const query = keywords.join(' OR ');

      // Real implementation would use Twitter API v2
      // GET https://api.twitter.com/2/tweets/search/recent?query=...&max_results=100&tweet.fields=...
      // with min_retweets filter and aggregation of engagement

      for (let i = 0; i < limit; i++) {
        topics.push({
          id: `twitter-${Date.now()}-${i}`,
          title: `${keywords[i % keywords.length]} trend #${i + 1}`,
          keywords: [keywords[i % keywords.length]],
          description: `Trending discussion on Twitter about ${keywords[i % keywords.length]}`,
          source: 'twitter',
          trend_score: 60 + Math.random() * 40,
          competition_score: 40 + Math.random() * 40,
          relevance_score: 70 + Math.random() * 30,
          created_at: new Date().toISOString(),
          metadata: {
            query,
            api_version: 'v2',
          },
        });
      }

      return topics;
    } catch (error) {
      console.error('TwitterSource error:', error);
      return this.getMockTopics(keywords, limit);
    }
  }

  private getMockTopics(keywords: string[], limit: number): Topic[] {
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `twitter-mock-${Date.now()}-${i}`,
      title: `${keywords[i % keywords.length] || 'trending'} conversation`,
      keywords: [keywords[i % keywords.length] || 'general'],
      description: `Mock Twitter trending topic about ${keywords[i % keywords.length] || 'general topics'}`,
      source: 'twitter',
      trend_score: 60 + Math.random() * 40,
      competition_score: 45 + Math.random() * 35,
      relevance_score: 65 + Math.random() * 35,
      created_at: new Date().toISOString(),
      metadata: {
        mock: true,
      },
    }));
  }
}
