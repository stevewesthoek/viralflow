export const LONGFORM_PATTERNS = [
  {
    name: 'myth_vs_reality',
    template: 'Everyone thinks {old}, but {new}',
    emotion: 'contrarian' as const,
  },
  {
    name: 'problem_vs_solution',
    template: 'Most people {problem}, but winners {solution}',
    emotion: 'benefit' as const,
  },
  {
    name: 'old_method_vs_new',
    template: 'Stop doing {old}, try {new} instead',
    emotion: 'urgency' as const,
  },
  {
    name: 'misconception_vs_truth',
    template: "You've been told {old}, but it's actually {new}",
    emotion: 'proof' as const,
  },
  {
    name: 'status_quo_vs_opportunity',
    template: 'While everyone does {old}, winners are {new}',
    emotion: 'curiosity' as const,
  },
];

export const SHORTFORM_PATTERNS = [
  {
    name: 'curiosity_hook',
    template: 'Wait till the end to see why {old} is {new}',
    emotion: 'curiosity' as const,
  },
  {
    name: 'rapid_transformation',
    template: '{old} to {new} in 60 seconds',
    emotion: 'benefit' as const,
  },
  {
    name: 'trend_twist',
    template: "Everyone's doing {old} wrong, here's {new}",
    emotion: 'contrarian' as const,
  },
  {
    name: 'bold_claim',
    template: 'If you still believe {old}, you\'re behind',
    emotion: 'fear' as const,
  },
  {
    name: 'surprising_fact',
    template: '{old} is actually {new} (and here\'s proof)',
    emotion: 'proof' as const,
  },
];

export const LINKEDIN_PATTERNS = [
  {
    name: 'career_advice_reversal',
    template: 'Stop following advice about {old}; do {new} instead',
    emotion: 'contrarian' as const,
  },
  {
    name: 'industry_insight',
    template: "Nobody's talking about {old}, but {new} is the future",
    emotion: 'curiosity' as const,
  },
  {
    name: 'skill_gap',
    template: 'Companies are paying for {new} skill, but nobody teaches {old}',
    emotion: 'benefit' as const,
  },
  {
    name: 'opportunity',
    template: 'By 2026, {old} will be obsolete; start learning {new} now',
    emotion: 'urgency' as const,
  },
  {
    name: 'leadership_shift',
    template: "The best leaders aren't doing {old} anymore; here's {new}",
    emotion: 'proof' as const,
  },
];
