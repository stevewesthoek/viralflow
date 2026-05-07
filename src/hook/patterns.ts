export const HOOK_PATTERNS = {
  curiosity_gap: {
    templates: [
      'This one weird trick...',
      'You won\'t believe what happens next...',
      'Scientists discovered...',
      'Wait till the end...',
      'Most people get this wrong...',
    ],
    baseScore: 84,
    peakDay: 1,
    description: 'Creates information asymmetry - "I know something you don\'t"',
  },
  fear_urgency: {
    templates: [
      'Only 3 spots left...',
      'By Friday this closes...',
      'The window is closing...',
      'This is disappearing...',
      'If you don\'t act now...',
    ],
    baseScore: 78,
    peakDay: 0,
    description: 'Creates time pressure and scarcity',
  },
  benefit: {
    templates: [
      'Learn how to...',
      'Discover the secret to...',
      'Here\'s how to increase...',
      'Save thousands with this...',
      'Get promoted by...',
    ],
    baseScore: 82,
    peakDay: 2,
    description: 'Direct value promise - highest CTR',
  },
  contrarian: {
    templates: [
      'Everyone\'s wrong about...',
      'You don\'t need...',
      'This is dying in 2026...',
      'Nobody talks about this...',
      'The truth nobody tells you...',
    ],
    baseScore: 89,
    peakDay: 1,
    description: 'Challenges status quo - highest engagement',
  },
  pattern_interrupt: {
    templates: [
      'Stop scrolling...',
      'You won\'t see this anywhere else...',
      'This changes everything...',
      'WATCH THIS...',
      'Listen up...',
    ],
    baseScore: 71,
    peakDay: 0,
    description: 'Breaks algorithmic prediction',
  },
  social_proof: {
    templates: [
      '10M people learned this...',
      'Trusted by Fortune 500...',
      'Harvard researchers found...',
      'My students earned...',
      'Warren Buffett once said...',
    ],
    baseScore: 76,
    peakDay: 3,
    description: 'Credibility and social validation',
  },
};
