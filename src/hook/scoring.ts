import { Hook, Angle, Topic, AgentBrain } from '../types';
import { HOOK_PATTERNS } from './patterns';

/**
 * Score a single hook on a 0-100 scale.
 *
 * Scoring combines:
 * 1. Base pattern effectiveness (research-backed baseline, ~70-89)
 * 2. Agent brain learning (what worked for YOUR audience, +0-40)
 * 3. Angle emotional resonance (hook pattern matches angle emotion, +0-10)
 * 4. Topic fit (contextual relevance, +0-5)
 *
 * The magic is #2: the agent brain. After you post videos and track performance,
 * the system learns which hook patterns drive engagement. Next time you generate
 * hooks, patterns that worked before get boosted.
 *
 * Example:
 * - All hooks start at base score (e.g., "contrarian" = 82)
 * - Your last 3 videos used "contrarian" hooks → 88%, 85%, 92% engagement
 * - Next time, contrarian gets +30 points (ranked highest by agent)
 * - Result: "contrarian" hook scores 85+30 = 115 (capped at 100)
 *
 * This is continuous learning, not manual tuning.
 *
 * @param hook The hook to score
 * @param context Optional context: agent brain (learning), angle (emotion fit), topic
 * @returns Score 0-100
 */
export function scoreHook(
  hook: Hook,
  context?: {
    agentBrain?: AgentBrain;
    angle?: Angle;
    topic?: Topic;
  }
): number {
  // Lookup the pattern definition (includes base score and description)
  const pattern = HOOK_PATTERNS[hook.pattern as keyof typeof HOOK_PATTERNS];
  if (!pattern) {
    return 50; // Unknown pattern falls back to neutral score
  }

  let score = pattern.baseScore; // Start with research-backed baseline (typically 71-89)

  // Agent Brain Learning: The secret sauce
  // After each video posts, we record performance. The agent brain learns:
  // "contrarian hooks drove 88% average engagement on this channel"
  // Next time, contrarian hooks get boosted. This compounds over time.
  // +40 points max = huge signal to use learned patterns
  if (context?.agentBrain) {
    const learnedPatterns = context.agentBrain.learned_patterns.best_hook_patterns;
    if (learnedPatterns.length > 0) {
      // learnedPatterns is ranked by actual performance (best first)
      const patternRank = learnedPatterns.indexOf(hook.pattern);
      if (patternRank !== -1) {
        // Top pattern gets +40, second gets less, etc.
        score += ((learnedPatterns.length - patternRank) / learnedPatterns.length) * 40;
      }
    }
  }

  // Angle Emotional Resonance: +10 if angle targets the same emotion
  // If angle targets "contrarian" emotion and hook is contrarian pattern, boost it
  // This ensures hook pattern matches angle framing
  if (context?.angle && context.angle.target_emotion === hook.pattern) {
    score += 10;
  }

  // Topic Fit: +5 for contextual relevance
  // Simple heuristic: if topic is explicitly about trends, trend-focused hooks fit better
  if (context?.topic) {
    const titleMatch = context.topic.title.toLowerCase().includes('trend')
      ? 5
      : 0;
    score += titleMatch;
  }

  // Cap at 100 to prevent scoring runaway (though rare with 50 max points per category)
  return Math.min(100, Math.round(score));
}

/**
 * Rank multiple hooks by score (highest to lowest).
 *
 * Returns the same hooks with scores attached, sorted by effectiveness.
 *
 * @example
 * const rankedHooks = rankHooks(hooks, { agentBrain, angle, topic });
 * // rankedHooks[0] = highest scoring hook
 * // rankedHooks[0].score = 92 (e.g.)
 */
export function rankHooks(
  hooks: Hook[],
  context?: {
    agentBrain?: AgentBrain;
    angle?: Angle;
    topic?: Topic;
  }
): Hook[] {
  return hooks
    .map((hook) => ({
      hook,
      score: scoreHook(hook, context),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => ({
      ...item.hook,
      score: item.score,
    }));
}
