import { Topic } from '../types';

export function generateContrastPairs(
  topic: Topic
): Array<{ old: string; new: string }> {
  const title = topic.title;
  const keywords = topic.keywords || [];

  const concepts = extractConcepts(title);

  const pairs: Array<{ old: string; new: string }> = [];

  for (const concept of concepts) {
    pairs.push({
      old: `Traditional approach to ${concept}`,
      new: `Modern approach to ${concept}`,
    });

    pairs.push({
      old: `Why people fail at ${concept}`,
      new: `How to win at ${concept}`,
    });

    pairs.push({
      old: `What people think about ${concept}`,
      new: `What's actually true about ${concept}`,
    });

    pairs.push({
      old: `The old way of ${concept}`,
      new: `The new way of ${concept}`,
    });

    pairs.push({
      old: `Common misconception: ${concept}`,
      new: `The truth: ${concept}`,
    });
  }

  if (keywords.length > 0) {
    const keyword = keywords[0];
    pairs.push({
      old: `Everyone's doing ${keyword}`,
      new: `Winners are doing ${keyword} differently`,
    });
  }

  return pairs.slice(0, 15);
}

function extractConcepts(title: string): string[] {
  const stopwords = ['a', 'an', 'the', 'for', 'with', 'of', 'and', 'or', 'in', 'to'];
  const words = title
    .toLowerCase()
    .split(' ')
    .filter((word) => !stopwords.includes(word) && word.length > 3);

  return [...new Set(words)].slice(0, 3);
}

export function buildAngleText(
  topic: Topic,
  contrast: { old: string; new: string },
  emotion: string
): string {
  const newValue = contrast.new;
  const oldValue = contrast.old;

  const templates: Record<string, (old: string, newVal: string) => string> = {
    curiosity: (old) => `Everyone thinks ${old}. Wait till you see what actually works.`,
    fear: (old) => `If you're still doing ${old}, you're making a big mistake.`,
    benefit: () => `Discover the proven strategy for ${topic.keywords[0] || 'success'}.`,
    contrarian: (old) => `Forget everything you know about ${old}.`,
    urgency: () => `This is changing everything. Here's why.`,
    proof: (old, newVal) => `Research shows: ${newVal} works better than ${old}.`,
  };

  const template = templates[emotion] || templates.benefit;
  return template(oldValue, newValue);
}
