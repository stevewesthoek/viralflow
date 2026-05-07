// Utility functions for Viral Flow

import * as crypto from 'crypto';

export function generateId(prefix: string = ''): string {
  const uniqueId = crypto.randomBytes(8).toString('hex');
  return prefix ? `${prefix}-${uniqueId}` : uniqueId;
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function calculateEngagementRate(
  likes: number,
  comments: number,
  shares: number,
  views: number,
): number {
  if (views === 0) return 0;
  return (likes + comments + shares) / views;
}

export function scorePerformance(metrics: {
  views: number;
  engagement_rate: number;
  click_through_rate?: number;
  conversion_rate?: number;
}): number {
  let score = 0;

  // Views contribution (0-40 points)
  if (metrics.views > 10000) score += 40;
  else if (metrics.views > 1000) score += Math.min(40, (metrics.views / 1000) * 4);
  else if (metrics.views > 0) score += Math.min(20, (metrics.views / 100) * 2);

  // Engagement contribution (0-40 points)
  score += Math.min(40, metrics.engagement_rate * 100);

  // CTR contribution (0-10 points)
  if (metrics.click_through_rate) {
    score += Math.min(10, metrics.click_through_rate * 100);
  }

  // Conversion contribution (0-10 points)
  if (metrics.conversion_rate) {
    score += Math.min(10, metrics.conversion_rate * 100);
  }

  return Math.min(100, Math.round(score));
}
