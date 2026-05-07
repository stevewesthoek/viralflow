import { Topic, DiscoverOptions } from '../types';
import { DiscoverSource } from './types';
import { YouTubeSource } from './youtube';
import { RedditSource } from './reddit';
import { CustomSource } from './custom';

const sources: Record<string, DiscoverSource> = {
  youtube: new YouTubeSource(),
  reddit: new RedditSource(),
  custom: new CustomSource(),
};

export function registerSource(name: string, source: DiscoverSource): void {
  sources[name] = source;
}

export async function discover(options: DiscoverOptions): Promise<Topic[]> {
  const {
    sources: requestedSources,
    keywords = [],
    icp_filter,
    max_results = 10,
  } = options;

  if (requestedSources.length === 0) {
    throw new Error('At least one discovery source must be specified');
  }

  if (keywords.length === 0) {
    throw new Error('At least one keyword must be specified');
  }

  const results = await Promise.all(
    requestedSources.map(async (sourceName: string) => {
      const source = sources[sourceName];
      if (!source) {
        console.warn(`Unknown discovery source: ${sourceName}. Skipping.`);
        return [];
      }
      try {
        return await source.discover(keywords);
      } catch (error) {
        console.warn(`Discovery from ${sourceName} failed:`, error);
        return [];
      }
    })
  );

  const allTopics = results.flat();
  const deduped = deduplicateTopics(allTopics);

  const scored = deduped.map((topic) => {
    let score = topic.trend_score * 0.5 + (100 - topic.competition_score) * 0.3;

    if (icp_filter) {
      const icpRelevance = calculateIcpRelevance(topic, icp_filter);
      score += icpRelevance * 0.2;
    }

    return { topic, score };
  });

  const ranked = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, max_results)
    .map((item) => item.topic);

  return ranked;
}

function deduplicateTopics(topics: Topic[]): Topic[] {
  const seen = new Set<string>();
  return topics.filter((topic) => {
    const normalized = topic.title.toLowerCase();
    if (seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

function calculateIcpRelevance(topic: Topic, icpFilter: string): number {
  const titleLower = topic.title.toLowerCase();
  const icpLower = icpFilter.toLowerCase();

  if (titleLower.includes(icpLower)) {
    return 100;
  }

  const keywords = icpLower.split(' ');
  const matches = keywords.filter((kw) => titleLower.includes(kw)).length;
  return (matches / keywords.length) * 100;
}

export { DiscoverSource, YouTubeSource, RedditSource, CustomSource };
