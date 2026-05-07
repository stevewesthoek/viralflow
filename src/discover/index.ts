import { Topic, DiscoverOptions } from '../types';
import { DiscoverSource } from './types';
import { YouTubeSource } from './youtube';
import { RedditSource } from './reddit';
import { TwitterSource } from './twitter';
import { TikTokTrendsSource } from './tiktok-trends';
import { CustomSource } from './custom';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Discovery source registry: extensible architecture for custom sources
// Add your own discovery source by calling registerSource('my-source', sourceInstance)
const sources: Record<string, DiscoverSource> = {
  youtube: new YouTubeSource(),
  reddit: new RedditSource(),
  twitter: new TwitterSource(),
  'tiktok-trends': new TikTokTrendsSource(),
  custom: new CustomSource(),
};

// Cache configuration
const CACHE_DIR = path.join(process.env.HOME || '.', '.viral-flow', 'cache');
const CACHE_TTL_MINUTES = parseInt(process.env.VIRAL_FLOW_CACHE_TTL_MINUTES || '60', 10);
const CACHE_ENABLED = process.env.NODE_ENV !== 'test';

/**
 * Register a custom discovery source.
 *
 * This is the extension point for adding new discovery sources beyond YouTube and Reddit.
 * Implement DiscoverSource interface and register it here.
 *
 * @example
 * import { registerSource } from 'viralflow';
 * import { TwitterSource } from './twitter-source';
 *
 * registerSource('twitter', new TwitterSource());
 *
 * // Now use it:
 * const topics = await discover({
 *   sources: ['twitter', 'youtube'],
 *   keywords: ['AI'],
 * });
 */
export function registerSource(name: string, source: DiscoverSource): void {
  sources[name] = source;
}

/**
 * Discover trending topics from multiple sources.
 *
 * The discovery engine orchestrates parallel requests to multiple sources,
 * deduplicates results, and ranks by composite score:
 * - trend_score × 0.5 (what's hot right now)
 * - (100 - competition) × 0.3 (how crowded is it)
 * - ICP_relevance × 0.2 (fit to your ideal customer profile)
 *
 * This composite scoring prevents discovering "hot" but irrelevant topics.
 *
 * @param options Discovery options: sources, keywords, optional ICP filter
 * @returns Topics ranked by relevance + trend + audience fit
 *
 * @example
 * const topics = await discover({
 *   sources: ['youtube', 'reddit'],
 *   keywords: ['AI automation'],
 *   icp_filter: 'B2B SaaS founders',
 *   max_results: 5,
 * });
 *
 * // Returns 5 topics ranked by composite score
 * topics[0]; // { title: "...", trend_score: 87, competition_score: 45, ... }
 */
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

  // Check cache first (disabled in tests)
  if (CACHE_ENABLED) {
    const cacheKey = generateCacheKey({ requestedSources, keywords, icp_filter });
    const cached = getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Parallel discovery from multiple sources (YouTube + Reddit + Twitter + TikTok simultaneously)
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

  // Composite score balances trend (50%) + low competition (30%) + audience fit (20%)
  // This prevents chasing irrelevant trends or overcrowded niches
  const scored = deduped.map((topic) => {
    let score = topic.trend_score * 0.5 + (100 - topic.competition_score) * 0.3;

    if (icp_filter) {
      const icpRelevance = calculateIcpRelevance(topic, icp_filter);
      score += icpRelevance * 0.2;
    }

    return { topic, score };
  });

  // Rank by score and return top N results
  const ranked = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, max_results)
    .map((item) => item.topic);

  // Cache the result (disabled in tests)
  if (CACHE_ENABLED) {
    const cacheKey = generateCacheKey({ requestedSources, keywords, icp_filter });
    saveToCache(cacheKey, ranked);
  }

  return ranked;
}

function generateCacheKey(opts: { requestedSources: string[]; keywords: string[]; icp_filter?: string }): string {
  const key = JSON.stringify({ sources: opts.requestedSources.sort(), keywords: opts.keywords.sort(), icp: opts.icp_filter || '' });
  return crypto.createHash('sha256').update(key).digest('hex');
}

function getFromCache(key: string): Topic[] | null {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return null;
    }
    const filePath = path.join(CACHE_DIR, `discover-${key}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const stat = fs.statSync(filePath);
    const ageMs = Date.now() - stat.mtimeMs;
    const ttlMs = CACHE_TTL_MINUTES * 60 * 1000;
    if (ageMs > ttlMs) {
      fs.unlinkSync(filePath);
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function saveToCache(key: string, topics: Topic[]): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const filePath = path.join(CACHE_DIR, `discover-${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(topics), 'utf-8');
  } catch {
    // Silent fail: cache is optional
  }
}

/**
 * Deduplicate topics from multiple sources.
 *
 * Both YouTube and Reddit might surface the same topic, e.g.,
 * "AI replacing jobs" could be a YouTube trend AND a Reddit thread.
 * This function keeps only the first occurrence (highest source priority).
 */
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

/**
 * Calculate how relevant a topic is to your Ideal Customer Profile (ICP).
 *
 * Simple keyword matching: if your ICP is "B2B SaaS founders",
 * and the topic mentions "SaaS" or "founders", it gets a relevance boost.
 *
 * This keeps discovery focused on YOUR audience, not just trending topics.
 *
 * @example
 * calculateIcpRelevance(topic, 'B2B SaaS founders')
 * // Returns 0-100 relevance score
 */
function calculateIcpRelevance(topic: Topic, icpFilter: string): number {
  const titleLower = topic.title.toLowerCase();
  const icpLower = icpFilter.toLowerCase();

  // Direct match: e.g., topic title contains entire ICP string
  if (titleLower.includes(icpLower)) {
    return 100;
  }

  // Partial match: count how many keywords match
  const keywords = icpLower.split(' ');
  const matches = keywords.filter((kw) => titleLower.includes(kw)).length;
  return (matches / keywords.length) * 100;
}

export { DiscoverSource, YouTubeSource, RedditSource, TwitterSource, TikTokTrendsSource, CustomSource };
