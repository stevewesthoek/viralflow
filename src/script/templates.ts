export const LONGFORM_TEMPLATE = `[HOOK - 10 sec]
{hook}

[OPENING - 20 sec]
I used to think {old}. Then I discovered {new}. Here's how it changed everything.

[BODY - 2-4 min]
First, let's understand why {old} doesn't work anymore.

The key insight: {new}

Here's the strategy that actually works:
1. {point_1}
2. {point_2}
3. {point_3}

The results speak for themselves.

[CLOSING - 10 sec]
So here's what to do: {action}. Try it this week and let me know in the comments if this worked for you.`;

export const SHORTFORM_TEMPLATE = `[HOOK - 2-3 sec]
{hook}

[RAPID DELIVERY - 3-5 sec]
{new}

[TWIST - 2-3 sec]
Here's why: {old} is outdated

[IMPLIED CTA]
Follow for more ➡️`;

export const LINKEDIN_TEMPLATE = `[HOOK]
{hook}

[INSIGHT]
Here's why {new} matters more than {old}:

{point_1}
{point_2}
{point_3}

[ACTION]
If you're in {role}, consider testing this approach.

What's your experience? Comment below.`;

export const SCRIPT_TEMPLATES = {
  longform: LONGFORM_TEMPLATE,
  shortform: SHORTFORM_TEMPLATE,
  linkedin: LINKEDIN_TEMPLATE,
};

export const ESTIMATED_WORD_COUNTS = {
  longform: 250,
  shortform: 50,
  linkedin: 180,
};

export const ESTIMATED_DURATIONS = {
  longform: 300, // 5 minutes
  shortform: 45, // 45 seconds
  linkedin: 60, // 1 minute reading time
};
