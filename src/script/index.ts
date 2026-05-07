import { Topic, Angle, Script, ScriptBuilderOptions } from '../types';
import { generateId, getCurrentTimestamp } from '../utils';
import {
  SCRIPT_TEMPLATES,
  ESTIMATED_DURATIONS,
  ESTIMATED_WORD_COUNTS,
} from './templates';

export function buildScript(options: ScriptBuilderOptions): Script {
  const { topic, angle, hook, format, duration } = options;

  const template = SCRIPT_TEMPLATES[format as keyof typeof SCRIPT_TEMPLATES];
  if (!template) {
    throw new Error(`Unknown format: ${format}`);
  }

  let content = template;

  content = content.replace(/{hook}/g, hook.text);
  content = content.replace(/{old}/g, angle.contrast_pair.old);
  content = content.replace(/{new}/g, angle.contrast_pair.new);
  content = content.replace(/{topic}/g, topic.title);

  content = content.replace(/{role}/g, 'content creator');
  content = content.replace(/{action}/g, `test this with your ${topic.keywords[0] || 'content'}`);

  if (content.includes('{point_1}')) {
    const points = generateContentPoints(topic, angle);
    content = content.replace(/{point_1}/g, points[0]);
    content = content.replace(/{point_2}/g, points[1]);
    content = content.replace(/{point_3}/g, points[2]);
  }

  const estimatedDuration = duration || ESTIMATED_DURATIONS[format as keyof typeof ESTIMATED_DURATIONS];

  const script: Script = {
    id: generateId('script'),
    topic_id: topic.id,
    angle_id: angle.id,
    hook_id: hook.id,
    title: generateScriptTitle(topic, angle),
    content,
    format,
    estimated_duration: estimatedDuration,
    created_at: getCurrentTimestamp(),
  };

  return script;
}

function generateContentPoints(topic: Topic, angle: Angle): string[] {
  return [
    `${angle.contrast_pair.old} used to be the standard, but ${angle.contrast_pair.new} is changing the game.`,
    `The proof: when people switch from ${angle.contrast_pair.old} to ${angle.contrast_pair.new}, they see immediate results.`,
    `This shift is happening across ${topic.keywords[0] || 'the industry'}, and early adopters have a 6-month advantage.`,
  ];
}

function generateScriptTitle(topic: Topic, angle: Angle): string {
  return `${angle.contrast_pair.new}: ${topic.title}`;
}

export { SCRIPT_TEMPLATES, ESTIMATED_DURATIONS, ESTIMATED_WORD_COUNTS };
