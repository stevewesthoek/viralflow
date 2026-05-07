import { Hook, Topic, Angle, HookGeneratorOptions, AgentBrain } from '../types';
import { generateId, getCurrentTimestamp } from '../utils';
import { HOOK_PATTERNS } from './patterns';
import { scoreHook, rankHooks } from './scoring';

export function generateHooks(options: HookGeneratorOptions): Hook[] {
  const { topic, angle, num_hooks = 3 } = options;

  const hooks: Hook[] = [];

  // Generate 1-2 variations for each of 6 patterns
  Object.entries(HOOK_PATTERNS).forEach(([pattern, data]) => {
    const templates = data.templates;
    const numVariations = pattern === 'contrarian' ? 2 : 1;

    for (let i = 0; i < Math.min(numVariations, templates.length); i += 1) {
      const template = templates[i];
      let hookText = template;

      // Replace placeholders with topic/angle info
      if (topic) {
        hookText = hookText.replace('{topic}', topic.keywords[0] || 'this');
        hookText = hookText.replace('{keyword}', topic.keywords[0] || 'this');
      }

      if (angle) {
        hookText = hookText.replace('{old}', angle.contrast_pair.old);
        hookText = hookText.replace('{new}', angle.contrast_pair.new);
      }

      const hook: Hook = {
        id: generateId('hook'),
        text: hookText,
        pattern: pattern as keyof typeof HOOK_PATTERNS,
        score: 0, // Will be scored below
        created_at: getCurrentTimestamp(),
      };

      hooks.push(hook);
    }
  });

  // Score and rank
  const scored = hooks.map((hook) => ({
    ...hook,
    score: scoreHook(hook, { angle, topic }),
  }));

  const ranked = scored.sort((a, b) => b.score - a.score);

  return ranked.slice(0, num_hooks);
}

export function generateHooksForPatterns(
  topic: Topic,
  angle: Angle,
  patterns: string[],
  agentBrain?: AgentBrain
): Hook[] {
  const hooks: Hook[] = [];

  for (const pattern of patterns) {
    const data = HOOK_PATTERNS[pattern as keyof typeof HOOK_PATTERNS];
    if (!data) continue;

    const template = data.templates[0];
    let hookText = template;

    hookText = hookText.replace('{topic}', topic.keywords[0] || 'this');
    hookText = hookText.replace('{old}', angle.contrast_pair.old);
    hookText = hookText.replace('{new}', angle.contrast_pair.new);

    const tempHook: Hook = {
      id: '',
      text: hookText,
      pattern: pattern as keyof typeof HOOK_PATTERNS,
      score: 0,
      created_at: '',
    };

    const hook: Hook = {
      id: generateId('hook'),
      text: hookText,
      pattern: pattern as keyof typeof HOOK_PATTERNS,
      score: scoreHook(tempHook, { topic, angle, agentBrain }),
      created_at: getCurrentTimestamp(),
    };

    hooks.push(hook);
  }

  return hooks.sort((a, b) => b.score - a.score);
}

export { scoreHook, rankHooks };
