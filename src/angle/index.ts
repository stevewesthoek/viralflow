import { Angle, AngleGeneratorOptions } from '../types';
import { generateId, getCurrentTimestamp } from '../utils';
import { generateContrastPairs, buildAngleText } from './contrast-formula';
import { LONGFORM_PATTERNS, SHORTFORM_PATTERNS, LINKEDIN_PATTERNS } from './patterns';

interface PatternInfo {
  name: string;
  template: string;
  emotion: string;
}

const PATTERN_MAP: Record<string, PatternInfo[]> = {
  longform: LONGFORM_PATTERNS,
  shortform: SHORTFORM_PATTERNS,
  linkedin: LINKEDIN_PATTERNS,
};

export function generateAngles(options: AngleGeneratorOptions): Angle[] {
  const { topic, formats, num_angles = 15 } = options;
  const selectedFormats = formats || ['longform', 'shortform', 'linkedin'];

  const angles: Angle[] = [];
  const contrasts = generateContrastPairs(topic);

  for (const format of selectedFormats) {
    const patterns = PATTERN_MAP[format] || LONGFORM_PATTERNS;
    const anglesPerFormat = Math.ceil(num_angles / selectedFormats.length);

    for (let i = 0; i < Math.min(patterns.length, anglesPerFormat); i += 1) {
      const pattern = patterns[i];
      const contrast = contrasts[i % contrasts.length];

      const angleText = buildAngleText(topic, contrast, pattern.emotion);

      const angle: Angle = {
        id: generateId('angle'),
        topic_id: topic.id,
        angle_text: angleText,
        format: format as 'longform' | 'shortform' | 'linkedin',
        contrast_pair: contrast,
        target_emotion: pattern.emotion as 'curiosity' | 'fear' | 'benefit' | 'contrarian' | 'urgency' | 'proof',
        created_at: getCurrentTimestamp(),
      };

      angles.push(angle);
    }
  }

  return angles.slice(0, num_angles);
}

export { generateContrastPairs, buildAngleText };
