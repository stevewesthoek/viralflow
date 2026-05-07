export interface Topic {
  id: string;
  title: string;
  keywords: string[];
  description: string;
  source: 'youtube' | 'reddit' | 'custom' | string;
  trend_score: number;
  competition_score: number;
  relevance_score: number;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface Angle {
  id: string;
  topic_id: string;
  angle_text: string;
  format: 'longform' | 'shortform' | 'linkedin';
  contrast_pair: { old: string; new: string };
  target_emotion: 'curiosity' | 'fear' | 'benefit' | 'contrarian' | 'urgency' | 'proof';
  created_at: string;
}

export interface Hook {
  id: string;
  text: string;
  pattern: 'curiosity_gap' | 'fear_urgency' | 'benefit' | 'contrarian' | 'pattern_interrupt' | 'social_proof';
  score: number;
  created_at: string;
}

export interface Script {
  id: string;
  topic_id: string;
  angle_id: string;
  hook_id: string;
  title: string;
  content: string;
  format: string;
  estimated_duration: number;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  script_id: string;
  platform: string;
  views: number;
  engagement_rate: number;
  click_through_rate?: number;
  conversion_rate?: number;
  hook_performance?: number;
  recorded_at: string;
}

export interface AgentBrain {
  icp: string;
  pillar_topics: string[];
  learned_patterns: {
    best_hook_patterns: string[];
    best_angles: string[];
    best_platforms: string[];
    audience_preferences: Record<string, unknown>;
  };
  performance_history: PerformanceMetric[];
  last_updated: string;
}

export interface DiscoverOptions {
  sources: ('youtube' | 'reddit' | 'custom' | string)[];
  keywords?: string[];
  icp_filter?: string;
  max_results?: number;
}

export interface AngleGeneratorOptions {
  topic: Topic;
  formats?: ('longform' | 'shortform' | 'linkedin')[];
  num_angles?: number;
}

export interface HookGeneratorOptions {
  topic: Topic;
  angle: Angle;
  num_hooks?: number;
}

export interface ScriptBuilderOptions {
  topic: Topic;
  angle: Angle;
  hook: Hook;
  format: 'longform' | 'shortform' | 'linkedin';
  duration?: number;
}

export interface AnalyzeOptions {
  script_id: string;
  metrics: {
    platform: string;
    views: number;
    engagement_rate: number;
    click_through_rate?: number;
    conversion_rate?: number;
  };
}
