import axios from 'axios';
import { Topic } from '../types';
import { DiscoverSource } from './types';
import { generateId, getCurrentTimestamp } from '../utils';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: { title: string; description: string; channelTitle: string };
}

export class YouTubeSource implements DiscoverSource {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.YOUTUBE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('YouTubeSource: YOUTUBE_API_KEY not set. Discovery will return mock data.');
    }
  }

  async discover(keywords: string[]): Promise<Topic[]> {
    if (!this.apiKey) {
      return this.mockDiscovery(keywords);
    }

    try {
      const results: Topic[] = [];
      for (const keyword of keywords) {
        const topics = await this.searchTrending(keyword);
        results.push(...topics);
      }
      return results.slice(0, 50).sort((a, b) => b.trend_score - a.trend_score);
    } catch (error) {
      console.warn('YouTubeSource: API error, falling back to mock data', error);
      return this.mockDiscovery(keywords);
    }
  }

  private async searchTrending(keyword: string): Promise<Topic[]> {
    const url = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
      key: this.apiKey,
      q: keyword,
      part: 'snippet',
      type: 'video',
      order: 'viewCount',
      maxResults: 10,
      relevanceLanguage: 'en',
      regionCode: 'US',
    };

    try {
      const response = await axios.get(url, { params });
      const items: YouTubeSearchItem[] = response.data.items || [];

      return items.map((item) => ({
        id: generateId('topic'),
        title: item.snippet.title,
        keywords: [keyword],
        description: item.snippet.description || '',
        source: 'youtube' as const,
        trend_score: 75 + Math.random() * 25,
        competition_score: 50 + Math.random() * 50,
        relevance_score: 70 + Math.random() * 30,
        created_at: getCurrentTimestamp(),
        metadata: {
          youtube_video_id: item.id.videoId,
          channel: item.snippet.channelTitle,
        },
      }));
    } catch (error) {
      console.warn(`YouTubeSource: Failed to search for "${keyword}"`, error);
      return [];
    }
  }

  private mockDiscovery(keywords: string[]): Topic[] {
    const mockTopics = [
      {
        title: 'AI Automation for Content Creators',
        trendScore: 92,
        competitionScore: 65,
      },
      {
        title: 'How to Make Money with AI',
        trendScore: 88,
        competitionScore: 72,
      },
      {
        title: 'Personal Branding in 2026',
        trendScore: 81,
        competitionScore: 55,
      },
      {
        title: 'ChatGPT Hacks and Tricks',
        trendScore: 79,
        competitionScore: 80,
      },
      {
        title: 'Passive Income Strategies',
        trendScore: 85,
        competitionScore: 68,
      },
    ];

    return mockTopics.map((topic) => ({
      id: generateId('topic'),
      title: topic.title,
      keywords,
      description: `Trending topic about ${topic.title.toLowerCase()}`,
      source: 'youtube' as const,
      trend_score: topic.trendScore,
      competition_score: topic.competitionScore,
      relevance_score: 70 + Math.random() * 30,
      created_at: getCurrentTimestamp(),
      metadata: { mock: true },
    }));
  }
}
