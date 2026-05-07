/**
 * Account and credential management types
 */

export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'facebook' | 'bluesky' | 'x' | 'custom';

/**
 * Platform-specific credentials
 */
export interface PlatformCredentials {
  api_key?: string;
  api_secret?: string;
  access_token?: string;
  refresh_token?: string;
  user_id?: string;
  channel_id?: string;
  account_id?: string;
  custom_field?: Record<string, string>;
}

/**
 * Represents a single platform account
 */
export interface Account {
  id: string;
  name: string; // User-friendly name (e.g., "Main YouTube Channel")
  platform: Platform;
  handle: string; // Username or channel handle
  credentials: PlatformCredentials;
  audience_demographics?: {
    total_followers: number;
    avg_views_per_video: number;
    engagement_rate: number;
    primary_demographics: string; // e.g., "18-35, US, Tech"
  };
  created_at: string;
  last_used: string;
  is_active: boolean;
}

/**
 * Series - grouped videos with consistent theme/voice
 */
export interface Series {
  id: string;
  name: string;
  description: string;
  account_ids: string[]; // Which accounts this series posts to
  posting_schedule?: {
    frequency: 'daily' | 'weekly' | 'custom';
    preferred_days?: number[]; // 0-6 for day of week
    preferred_times?: string[]; // HH:MM format
  };
  content_guidelines?: {
    min_duration?: number; // seconds
    max_duration?: number;
    format: 'longform' | 'shortform' | 'mixed';
    min_scripts_per_week: number;
  };
  performance_baseline?: {
    avg_views: number;
    avg_engagement_rate: number;
    target_views?: number;
    target_engagement_rate?: number;
  };
  created_at: string;
  updated_at: string;
}

/**
 * Platform-specific strategy
 */
export interface PlatformStrategy {
  platform: Platform;
  format: 'longform' | 'shortform' | 'mixed';
  aspect_ratio: string; // e.g., "16:9", "9:16", "1:1"
  max_duration: number; // seconds
  upload_frequency: number; // times per week
  optimal_posting_time: string; // HH:MM
  hashtag_strategy?: {
    count: number;
    include_branded: boolean;
    include_trending: boolean;
  };
}

/**
 * Account registry - centralized account management
 */
export interface AccountRegistry {
  accounts: Account[];
  series: Series[];
  platform_strategies: Record<Platform, PlatformStrategy>;
  default_account?: string; // Default account ID
  created_at: string;
  updated_at: string;
}
