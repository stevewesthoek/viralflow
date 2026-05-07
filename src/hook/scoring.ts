import { Hook, Angle, Topic, AgentBrain } from '../types';
import { HOOK_PATTERNS } from './patterns';

export function scoreHook(
  hook: Hook,
  context?: {
    agentBrain?: AgentBrain;
    angle?: Angle;
    topic?: Topic;
  }
): number {
  const pattern = HOOK_PATTERNS[hook.pattern as keyof typeof HOOK_PATTERNS];
  if (!pattern) {
    return 50;
  }

  let score = pattern.baseScore;

  // Agent brain learned performance (40 points max)
  if (context?.agentBrain) {
    const learnedPatterns = context.agentBrain.learned_patterns.best_hook_patterns;
    if (learnedPatterns.length > 0) {
      const patternRank = learnedPatterns.indexOf(hook.pattern);
      if (patternRank !== -1) {
        score += ((learnedPatterns.length - patternRank) / learnedPatterns.length) * 40;
      }
    }
  }

  // Angle emotional resonance (10 points max)
  if (context?.angle && context.angle.target_emotion === hook.pattern) {
    score += 10;
  }

  // Topic fit (5 points max)
  if (context?.topic) {
    const titleMatch = context.topic.title.toLowerCase().includes('trend')
      ? 5
      : 0;
    score += titleMatch;
  }

  return Math.min(100, Math.round(score));
}

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
