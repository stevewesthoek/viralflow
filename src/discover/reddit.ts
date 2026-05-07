import axios from 'axios';
import { Topic } from '../types';
import { DiscoverSource } from './types';
import { generateId, getCurrentTimestamp } from '../utils';

interface RedditPost {
  data: { id: string; title: string; selftext: string; score: number; subreddit: string; num_comments: number };
}

export class RedditSource implements DiscoverSource {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || process.env.REDDIT_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.REDDIT_CLIENT_SECRET || '';
    if (!this.clientId || !this.clientSecret) {
      console.warn('RedditSource: Credentials not set. Discovery will return mock data.');
    }
  }

  async discover(keywords: string[]): Promise<Topic[]> {
    if (!this.clientId || !this.clientSecret) {
      return this.mockDiscovery(keywords);
    }

    try {
      const results: Topic[] = [];
      for (const keyword of keywords) {
        const topics = await this.searchSubreddits(keyword);
        results.push(...topics);
      }
      return results.slice(0, 50).sort((a, b) => b.trend_score - a.trend_score);
    } catch (error) {
      console.warn('RedditSource: API error, falling back to mock data', error);
      return this.mockDiscovery(keywords);
    }
  }

  private async searchSubreddits(keyword: string): Promise<Topic[]> {
    try {
      const token = await this.getAccessToken();
      const url = `https://oauth.reddit.com/r/all/search?q=${keyword}&sort=top&t=week`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'ViralFlow/1.0',
        },
      });

      const posts: RedditPost[] = response.data?.data?.children || [];

      return posts.slice(0, 10).map((post) => ({
        id: generateId('topic'),
        title: post.data.title,
        keywords: [keyword],
        description: post.data.selftext || post.data.title,
        source: 'reddit' as const,
        trend_score: Math.min(100, 50 + post.data.score / 100),
        competition_score: 50 + Math.random() * 50,
        relevance_score: 70 + Math.random() * 30,
        created_at: getCurrentTimestamp(),
        metadata: {
          reddit_post_id: post.data.id,
          subreddit: post.data.subreddit,
          upvotes: post.data.score,
          comments: post.data.num_comments,
        },
      }));
    } catch (error) {
      console.warn(`RedditSource: Failed to search for "${keyword}"`, error);
      return [];
    }
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ViralFlow/1.0',
        },
      }
    );
    return response.data.access_token;
  }

  private mockDiscovery(keywords: string[]): Topic[] {
    const mockTopics = [
      {
        title: 'The future of AI and content creation',
        subreddit: 'r/Futurology',
        upvotes: 2500,
      },
      {
        title: 'Best tools for content creators in 2026',
        subreddit: 'r/contentcreators',
        upvotes: 1800,
      },
      {
        title: 'How automation changed my business',
        subreddit: 'r/Entrepreneur',
        upvotes: 3200,
      },
      {
        title: 'AI writing tools comparison',
        subreddit: 'r/writing',
        upvotes: 1200,
      },
      {
        title: 'Passive income with automation',
        subreddit: 'r/passive_income',
        upvotes: 2800,
      },
    ];

    return mockTopics.map((topic) => ({
      id: generateId('topic'),
      title: topic.title,
      keywords,
      description: `Discussion from ${topic.subreddit}`,
      source: 'reddit' as const,
      trend_score: Math.min(100, 50 + topic.upvotes / 100),
      competition_score: 50 + Math.random() * 50,
      relevance_score: 70 + Math.random() * 30,
      created_at: getCurrentTimestamp(),
      metadata: { mock: true, subreddit: topic.subreddit },
    }));
  }
}
