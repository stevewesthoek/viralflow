// Viral Flow - Main Entry Point

export * from './types';
export * from './utils';

// Discover workflow
export { discover, registerSource, DiscoverSource } from './discover';
export { YouTubeSource, RedditSource, CustomSource } from './discover';

// Angle workflow
export { generateAngles, generateContrastPairs, buildAngleText } from './angle';

// Hook workflow
export { generateHooks, generateHooksForPatterns, scoreHook, rankHooks } from './hook';

// Script workflow
export { buildScript, SCRIPT_TEMPLATES, ESTIMATED_DURATIONS } from './script';

// Analyze workflow
export { recordPerformance, analyzePatterns } from './analyze';
