import * as fs from 'fs';
import * as path from 'path';
import { AdvancedAgentBrain } from './types';
import { getCurrentTimestamp } from '../utils';

/**
 * Brain persistence layer - save/load agent brain from JSON
 */

const DEFAULT_BRAIN_DIR = './.viral-brain';
const DEFAULT_BRAIN_FILE = 'agent-brain.json';

/**
 * Initialize brain directory if it doesn't exist
 */
export function initializeBrainDirectory(brainDir: string = DEFAULT_BRAIN_DIR): void {
  if (!fs.existsSync(brainDir)) {
    fs.mkdirSync(brainDir, { recursive: true });
  }
}

/**
 * Create a new agent brain with default values
 */
export function createNewBrain(
  icp: string,
  pillarTopics: string[] = []
): AdvancedAgentBrain {
  return {
    icp,
    pillar_topics: pillarTopics,
    learned_patterns: {
      best_hook_patterns: [],
      best_angles: [],
      best_platforms: [],
      audience_preferences: {},
    },
    performance_history: [],
    last_updated: getCurrentTimestamp(),
    learning_history: [],
    pattern_confidence: {},
    platform_performance: [],
    learning_metadata: {
      total_metrics_processed: 0,
      confidence_threshold: 0.6,
      last_recalibration: getCurrentTimestamp(),
    },
  };
}

/**
 * Save agent brain to disk
 */
export function saveBrain(
  brain: AdvancedAgentBrain,
  brainDir: string = DEFAULT_BRAIN_DIR,
  filename: string = DEFAULT_BRAIN_FILE
): string {
  initializeBrainDirectory(brainDir);

  const filepath = path.join(brainDir, filename);
  const json = JSON.stringify(brain, null, 2);

  fs.writeFileSync(filepath, json, 'utf-8');

  return filepath;
}

/**
 * Load agent brain from disk
 */
export function loadBrain(
  brainDir: string = DEFAULT_BRAIN_DIR,
  filename: string = DEFAULT_BRAIN_FILE
): AdvancedAgentBrain | null {
  const filepath = path.join(brainDir, filename);

  if (!fs.existsSync(filepath)) {
    return null;
  }

  try {
    const json = fs.readFileSync(filepath, 'utf-8');
    const brain = JSON.parse(json) as AdvancedAgentBrain;
    return brain;
  } catch (error) {
    console.error(`Failed to load brain from ${filepath}:`, error);
    return null;
  }
}

/**
 * Get or create brain - loads from disk if exists, creates new otherwise
 */
export function getOrCreateBrain(
  icp: string,
  pillarTopics: string[] = [],
  brainDir: string = DEFAULT_BRAIN_DIR
): AdvancedAgentBrain {
  const existingBrain = loadBrain(brainDir);

  if (existingBrain) {
    return existingBrain;
  }

  return createNewBrain(icp, pillarTopics);
}

/**
 * Save and persist a brain instance
 */
export function persistBrain(
  brain: AdvancedAgentBrain,
  brainDir: string = DEFAULT_BRAIN_DIR
): void {
  brain.last_updated = getCurrentTimestamp();
  saveBrain(brain, brainDir);
}

/**
 * Export brain to JSON (for backup/export)
 */
export function exportBrainJSON(brain: AdvancedAgentBrain): string {
  return JSON.stringify(brain, null, 2);
}

/**
 * Import brain from JSON (for restore/import)
 */
export function importBrainJSON(json: string): AdvancedAgentBrain {
  return JSON.parse(json) as AdvancedAgentBrain;
}

/**
 * Merge two brains (for combining data)
 * Keeps the brain with more performance history
 */
export function mergeBrains(brain1: AdvancedAgentBrain, brain2: AdvancedAgentBrain): AdvancedAgentBrain {
  const keeperBrain = brain1.performance_history.length >= brain2.performance_history.length ? brain1 : brain2;
  const mergerBrain = brain1.performance_history.length >= brain2.performance_history.length ? brain2 : brain1;

  // Merge performance history (deduplicate by script_id + recorded_at)
  const seen = new Set<string>();
  const mergedHistory = [...keeperBrain.performance_history];

  mergerBrain.performance_history.forEach((metric) => {
    const key = `${metric.script_id}-${metric.recorded_at}`;
    if (!seen.has(key)) {
      mergedHistory.push(metric);
      seen.add(key);
    }
  });

  // Merge learning history
  const mergedLearning = [...keeperBrain.learning_history, ...mergerBrain.learning_history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return {
    ...keeperBrain,
    performance_history: mergedHistory,
    learning_history: mergedLearning,
    last_updated: getCurrentTimestamp(),
  };
}
