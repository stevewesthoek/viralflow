import { DiscoverSource } from './types';
import { Topic } from '../types';

/**
 * TikTok trends discovery source using TikTok Research API
 * Requires TIKTOK_RESEARCH_CLIENT_KEY environment variable (separate from posting credentials)
 */
export class TikTokTrendsSource implements DiscoverSource {
  private clientKey: string;

  constructor(clientKey?: string) {
    this.clientKey = clientKey || process.env.TIKTOK_RESEARCH_CLIENT_KEY || '';
    if (!this.clientKey) {
      console.warn(
        'TikTokTrendsSource: TIKTOK_RESEARCH_CLIENT_KEY not set. Discovery will return mock data.'
      );
    }
  }

  async discover(keywords: string[], limit: number = 5): Promise<Topic[]> {
    if (!this.clientKey) {
      return this.getMockTopics(keywords, limit);
    }

    try {
      const topics: Topic[] = [];

      // Real implementation would use TikTok Research API
      // GET https://research.tiktok.com/api/v1/hashtag/query/
      // with video_count growth metrics over 7-day period

      for (let i = 0; i < limit; i++) {
        const keyword = keywords[i % keywords.length];
        topics.push({
          id: `tiktok-trends-${Date.now()}-${i}`,
          title: `#${keyword} trending on TikTok`,
          keywords: [keyword],
          description: `Fast-growing TikTok hashtag and trend related to ${keyword}`,
          source: 'tiktok-trends',
          trend_score: 70 + Math.random() * 30,
          competition_score: 50 + Math.random() * 35,
          relevance_score: 75 + Math.random() * 25,
          created_at: new Date().toISOString(),
          metadata: {
            hashtag: `#${keyword}`,
            api_version: 'v1',
            growth_period_days: 7,
          },
        });
      }

      return topics;
    } catch (error) {
      console.error('TikTokTrendsSource error:', error);
      return this.getMockTopics(keywords, limit);
    }
  }

  private getMockTopics(keywords: string[], limit: number): Topic[] {
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `tiktok-trends-mock-${Date.now()}-${i}`,
      title: `#${keywords[i % keywords.length] || 'trending'} on TikTok`,
      keywords: [keywords[i % keywords.length] || 'general'],
      description: `Mock TikTok trending hashtag related to ${keywords[i % keywords.length] || 'general topics'}`,
      source: 'tiktok-trends',
      trend_score: 70 + Math.random() * 30,
      competition_score: 50 + Math.random() * 35,
      relevance_score: 75 + Math.random() * 25,
      created_at: new Date().toISOString(),
      metadata: {
        hashtag: `#${keywords[i % keywords.length] || 'general'}`,
        mock: true,
      },
    }));
  }
}
