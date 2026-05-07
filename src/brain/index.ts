import { AdvancedAgentBrain, LearnedInsights } from './types';
import { PerformanceMetric } from '../types';
import {
  createNewBrain,
  loadBrain,
  persistBrain,
  getOrCreateBrain,
  exportBrainJSON,
  importBrainJSON,
  mergeBrains,
} from './persistence';
import {
  rankHookPatterns,
  analyzeplatformPerformance,
  inferAudiencePreferences,
  updateLearnedPatterns,
  getLearnedInsights,
  recalibrateConfidence,
} from './learning';
import { getCurrentTimestamp } from '../utils';

/**
 * Brain manager - unified API for agent brain operations
 */

export class BrainManager {
  private brain: AdvancedAgentBrain;
  private brainDir: string;

  constructor(brain: AdvancedAgentBrain, brainDir: string = './.viral-brain') {
    this.brain = brain;
    this.brainDir = brainDir;
  }

  /**
   * Create a new brain manager with fresh brain
   */
  static createNew(icp: string, pillarTopics: string[] = [], brainDir?: string): BrainManager {
    const brain = createNewBrain(icp, pillarTopics);
    return new BrainManager(brain, brainDir);
  }

  /**
   * Load brain manager from disk
   */
  static loadFromDisk(brainDir: string = './.viral-brain'): BrainManager | null {
    const brain = loadBrain(brainDir);
    if (!brain) return null;
    return new BrainManager(brain, brainDir);
  }

  /**
   * Get or create brain manager
   */
  static getOrCreate(icp: string, pillarTopics: string[] = [], brainDir?: string): BrainManager {
    const brain = getOrCreateBrain(icp, pillarTopics, brainDir);
    return new BrainManager(brain, brainDir);
  }

  /**
   * Get the underlying brain object
   */
  getBrain(): AdvancedAgentBrain {
    return this.brain;
  }

  /**
   * Record a new performance metric and update learning
   */
  recordMetric(metric: PerformanceMetric): void {
    this.brain.performance_history.push(metric);
    this.brain.last_updated = getCurrentTimestamp();

    // Trigger learning update if we have enough data
    if (this.brain.performance_history.length >= 3) {
      updateLearnedPatterns(this.brain);
    }
  }

  /**
   * Record multiple metrics at once
   */
  recordMetrics(metrics: PerformanceMetric[]): void {
    metrics.forEach((metric) => this.recordMetric(metric));
  }

  /**
   * Get ranked hook patterns
   */
  getRankedPatterns() {
    return rankHookPatterns(this.brain);
  }

  /**
   * Get platform performance analysis
   */
  getPlatformAnalysis() {
    return analyzeplatformPerformance(this.brain);
  }

  /**
   * Get inferred audience preferences
   */
  getAudiencePreferences() {
    return inferAudiencePreferences(this.brain);
  }

  /**
   * Get complete insights
   */
  getInsights(): LearnedInsights {
    return getLearnedInsights(this.brain);
  }

  /**
   * Recalibrate confidence scores
   */
  recalibrateScores(): void {
    recalibrateConfidence(this.brain);
  }

  /**
   * Save brain to disk
   */
  save(): void {
    persistBrain(this.brain, this.brainDir);
  }

  /**
   * Export brain as JSON
   */
  exportJSON(): string {
    return exportBrainJSON(this.brain);
  }

  /**
   * Import brain from JSON
   */
  importJSON(json: string): void {
    this.brain = importBrainJSON(json);
  }

  /**
   * Merge with another brain
   */
  mergeWith(other: AdvancedAgentBrain): void {
    this.brain = mergeBrains(this.brain, other);
  }

  /**
   * Reset brain learning
   */
  resetLearning(): void {
    this.brain.learned_patterns = {
      best_hook_patterns: [],
      best_angles: [],
      best_platforms: [],
      audience_preferences: {},
    };
    this.brain.pattern_confidence = {};
    this.brain.platform_performance = [];
    this.brain.learning_history = [];
  }

  /**
   * Get learning statistics
   */
  getLearningStats() {
    return {
      total_metrics: this.brain.performance_history.length,
      learning_events: this.brain.learning_history.length,
      patterns_with_confidence: Object.keys(this.brain.pattern_confidence).length,
      average_confidence: Object.values(this.brain.pattern_confidence).length > 0
        ? Object.values(this.brain.pattern_confidence).reduce((a, b) => a + b, 0) / Object.values(this.brain.pattern_confidence).length
        : 0,
      last_updated: this.brain.last_updated,
      last_recalibration: this.brain.learning_metadata.last_recalibration,
    };
  }
}

export { AdvancedAgentBrain, LearnedInsights };
export * from './persistence';
export * from './learning';
