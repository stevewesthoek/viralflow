import { AgentBrain } from '../types';

/**
 * Represents a learned hook pattern with confidence metrics
 */
export interface LearnedHookPattern {
  pattern: string;
  total_uses: number;
  total_engagement: number;
  avg_performance: number; // 0-100
  confidence: number; // 0-1 (how confident in this learning)
  updated_at: string;
}

/**
 * Represents platform performance analytics
 */
export interface PlatformPerformance {
  platform: string;
  total_videos: number;
  total_views: number;
  avg_engagement_rate: number; // 0-1
  avg_ctr?: number; // click-through rate
  avg_conversion_rate?: number;
  confidence: number; // 0-1
  last_updated: string;
}

/**
 * Represents a historical learning event (audit trail)
 */
export interface LearningEvent {
  timestamp: string;
  event_type: 'pattern_ranked' | 'platform_learned' | 'preference_updated' | 'confidence_adjusted';
  details: Record<string, unknown>;
}

/**
 * Extended agent brain with learning history and confidence metrics
 */
export interface AdvancedAgentBrain extends AgentBrain {
  learning_history: LearningEvent[];
  pattern_confidence: Record<string, number>; // pattern -> confidence (0-1)
  platform_performance: PlatformPerformance[];
  learning_metadata: {
    total_metrics_processed: number;
    confidence_threshold: number; // Min confidence required for learning
    last_recalibration: string;
  };
}

/**
 * Configuration for agent brain learning
 */
export interface BrainLearningConfig {
  min_samples_for_learning?: number; // Default: 3 metrics to start learning
  confidence_decay_rate?: number; // How quickly old data becomes less confident (0-1)
  platform_weight?: number; // How heavily to weight platform selection
  pattern_weight?: number; // How heavily to weight hook patterns
}

/**
 * Result of analyzing learned patterns
 */
export interface LearnedInsights {
  best_patterns: LearnedHookPattern[];
  best_platforms: PlatformPerformance[];
  audience_profile: {
    prefers_longform: boolean | null;
    prefers_shortform: boolean | null;
    platform_tendency: string; // Most used platform
    engagement_trend: 'increasing' | 'stable' | 'decreasing';
  };
  recommendations: string[];
}
