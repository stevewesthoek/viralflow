# Viral Flow Architecture

**Design document for platform-agnostic content discovery and strategy system**

---

## System Overview

Viral Flow is a **content discovery and strategy pipeline** that helps creators identify winning topics, generate content angles, craft attention-grabbing hooks, and learn from performance data.

```
INPUT (Raw Ideas / Goals)
        ↓
┌─────────────────────────────────────────────────┐
│           VIRAL FLOW PIPELINE                   │
├─────────────────────────────────────────────────┤
│                                                  │
│ 1. DISCOVER  → Find trending topics             │
│ 2. ANGLE     → Generate 15 angles per topic     │
│ 3. HOOK      → Score and generate hooks        │
│ 4. SCRIPT    → Build complete scripts          │
│ 5. ANALYZE   → Track performance metrics        │
│                                                  │
│ AGENT BRAIN  → Learn and improve over time      │
│                                                  │
└─────────────────────────────────────────────────┘
        ↓
OUTPUT (Strategy Document ready for Production)
        ↓
[Pass to video/content production orchestrator]
        ↓
[Videos/content produced and published]
        ↓
[Performance data feeds back to Agent Brain]
```

---

## Core Data Model

All workflows operate on a unified data model:

### 1. Topic
**Represents a content idea or trend**

```typescript
{
  id: "topic-abc123",
  title: "AI Automation for Content Creators",
  keywords: ["AI", "automation", "creator economy"],
  description: "How AI tools are automating content production",
  source: "youtube", // or "reddit", "custom"
  trend_score: 87,    // 0-100, how trending is this
  competition_score: 62, // 0-100, how many creators cover this
  relevance_score: 94, // 0-100, how relevant to YOUR audience
  created_at: "2026-05-07T12:00:00Z",
  metadata: { ... }
}
```

**Why:** Topics are the starting point. Users discover what to create about.

### 2. Angle
**Represents a unique perspective on a topic**

```typescript
{
  id: "angle-xyz789",
  topic_id: "topic-abc123",
  angle_text: "Everyone automates their emails. Winners are automating their entire content pipeline.",
  format: "shortform", // longform | shortform | linkedin
  contrast_pair: {
    old: "Automate emails",
    new: "Automate content pipeline"
  },
  target_emotion: "contrarian",
  created_at: "2026-05-07T12:05:00Z"
}
```

**Why:** 15 angles per topic give you multiple framings. Pick the one that resonates.

### 3. Hook
**Represents an attention-grabbing opening**

```typescript
{
  id: "hook-def456",
  text: "Everyone's automating emails. Here's what winners automate instead.",
  pattern: "contrarian", // curiosity_gap | fear_urgency | benefit | contrarian | pattern_interrupt | social_proof
  score: 87, // 0-100, predicted performance
  created_at: "2026-05-07T12:10:00Z"
}
```

**Why:** Hooks are the critical first 3 seconds. Good patterns have measurable click-through rates.

### 4. Script
**Represents a complete content outline ready for production**

```typescript
{
  id: "script-ghi789",
  topic_id: "topic-abc123",
  angle_id: "angle-xyz789",
  hook_id: "hook-def456",
  title: "Why Winners Automate Content Pipelines",
  content: "Everyone thinks email automation is the future....",
  format: "shortform",
  estimated_duration: 45, // seconds
  created_at: "2026-05-07T12:15:00Z"
}
```

**Why:** Scripts are passed to production (video, podcast, blog). They're the output of strategy.

### 5. PerformanceMetric
**Represents how a script performed in the real world**

```typescript
{
  id: "metric-jkl012",
  script_id: "script-ghi789",
  platform: "tiktok",
  views: 15000,
  engagement_rate: 0.087, // (likes + comments + shares) / views
  click_through_rate: 0.12,
  conversion_rate: 0.03,
  hook_performance: 92, // How well the hook grabbed attention
  recorded_at: "2026-05-08T18:00:00Z"
}
```

**Why:** Performance data feeds the agent brain. Your agent learns what works for YOUR audience.

### 6. AgentBrain
**Represents what your agent has learned from performance data**

```typescript
{
  icp: "Content creators earning 6-7 figures, struggling with consistency",
  pillar_topics: [
    "AI automation for creators",
    "Personal branding",
    "Monetization strategies"
  ],
  learned_patterns: {
    best_hook_patterns: [
      "contrarian", // 89% avg engagement
      "curiosity_gap", // 84% avg engagement
      "pattern_interrupt" // 78% avg engagement
    ],
    best_angles: [
      "Everyone thinks X, winners do Y",
      "Rapid transformation (before/after)",
      "Surprising fact with proof"
    ],
    best_platforms: [
      "tiktok", // 8.3% engagement
      "youtube_shorts", // 7.1% engagement
      "instagram_reels" // 6.4% engagement
    ],
    audience_preferences: { ... }
  },
  performance_history: [ ...PerformanceMetric[] ],
  last_updated: "2026-05-08T18:00:00Z"
}
```

**Why:** Your agent improves with every video. Over time, suggestions get smarter.

---

## Workflow: DISCOVER

**Goal:** Find trending topics relevant to your audience.

### Sources (Extensible)

**YouTube** (via YouTube Data API v3)
- Fetch trending videos by region and category
- Score by view count, engagement rate, recency
- Filter for relevance to ICP

**Reddit** (via Reddit API)
- Scan trending subreddits by topic
- Extract discussion threads, upvotes, comments
- Score by engagement velocity

**Custom** (User-defined)
- User manually adds topics
- Used for private/proprietary topics
- Manually scored or learned from

**Adding a Custom Source:**

```typescript
// src/discover/my-source.ts
import { DiscoverSource } from '../types';

export class MySource implements DiscoverSource {
  async discover(keywords: string[]): Promise<Topic[]> {
    // 1. Fetch from your data source
    // 2. Score each result
    // 3. Return Topic[]
  }
}

// Then register in discover() function
const sources = {
  youtube: new YouTubeSource(),
  reddit: new RedditSource(),
  'my-source': new MySource(), // ← Your plugin
};
```

### Scoring Algorithm

Each topic is scored on three dimensions:

**Trend Score (0-100):** How much momentum does this topic have right now?
- YouTube: based on view velocity
- Reddit: based on upvote velocity
- Custom: user-provided

**Competition Score (0-100):** How crowded is this topic?
- YouTube: how many similar videos in past 30 days
- Reddit: how many threads discussing this
- Custom: user-provided

**Relevance Score (0-100):** How relevant is this to YOUR audience (ICP)?
- Keyword matching against pillar_topics
- Semantic similarity to past performance winners
- Agent brain learned_patterns matching

**Final Rank:** Trend - (Competition * 0.3) + (Relevance * 0.4)

---

## Workflow: ANGLE

**Goal:** Generate 15 unique perspectives on a topic.

### Contrast Formula

The core insight: **Great angles juxtapose an old belief against a new insight.**

```
Old: What people think / do / believe
  ↓ [REVELATION] ↓
New: What actually works / is true / is possible
```

### 15 Angles (5 per format)

**Longform (YouTube, Blog, Podcast) — 5 angles:**

1. **Myth vs. Reality**  
   Old: "Everyone says X is the best"  
   New: "Actually, Y works better"

2. **Problem vs. Solution**  
   Old: "Most people fail at X"  
   New: "Here's the winning approach"

3. **Old Method vs. New Method**  
   Old: "The traditional way is X"  
   New: "Winners are doing Y instead"

4. **Misconception vs. Truth**  
   Old: "You've been taught X"  
   New: "The truth is Y"

5. **Status Quo vs. Opportunity**  
   Old: "Everyone's doing X"  
   New: "Winners are doing Y"

**Shortform (TikTok, Reels, Shorts) — 5 angles:**

1. **Curiosity Hook**  
   "Wait till the end to see why X is actually Y"

2. **Rapid Transformation**  
   "X to Y in 60 seconds"

3. **Trend Twist**  
   "Everyone's doing X wrong, here's the right way"

4. **Bold Claim**  
   "If you still believe X, you're behind"

5. **Surprising Fact**  
   "X is actually Y (and here's proof)"

**LinkedIn (Professional) — 5 angles:**

1. **Career Advice Reversal**  
   "Stop following advice about X; do Y instead"

2. **Industry Insight**  
   "Nobody's talking about X, but it's the future"

3. **Skill Gap**  
   "Companies are paying for X skill, but nobody teaches it"

4. **Opportunity**  
   "By 2026, X will be obsolete; start learning Y now"

5. **Leadership Shift**  
   "The best leaders aren't doing X anymore; here's why"

### Implementation

```typescript
// src/angle/contrast-formula.ts
export function generateAngles(topic: Topic, formats: string[]): Angle[] {
  // 1. Extract key concepts from topic.title and keywords
  // 2. For each format (longform | shortform | linkedin):
  //    a. Apply 5 contrast patterns
  //    b. Generate angle_text by juxtaposing old vs new
  //    c. Assign target_emotion (curiosity | fear | benefit | contrarian | urgency | proof)
  // 3. Deduplicate and rank by relevance to AgentBrain patterns
  // 4. Return top 15 ranked angles
}
```

---

## Workflow: HOOK

**Goal:** Generate attention-grabbing openings using 6 validated copywriting patterns.

### 6 Hook Patterns

Based on research from copywriting and neuroscience:

1. **Curiosity Gap** (Most used in social media)
   - Creates information asymmetry: "I know something you don't"
   - Examples: "This one weird trick...", "Scientists discovered...", "Most people get this wrong"
   - Peak performance: Days 1-2 (novelty bonus)

2. **Fear/Urgency** (High conversion, medium virality)
   - Creates time pressure: "If you don't act now..."
   - Examples: "Only 3 spots left", "By Friday...", "The window is closing"
   - Peak performance: Consistent across time

3. **Benefit-Driven** (Highest CTR, lowest viral potential)
   - Direct value promise: "Learn how to..."
   - Examples: "Increase productivity by 40%", "Save $5k/month", "Get promoted"
   - Peak performance: Professional audiences (LinkedIn)

4. **Contrarian** (Highest engagement, medium reach)
   - Challenges status quo: "Everyone's wrong about..."
   - Examples: "You don't need a college degree", "Remote work is dying", "Crypto isn't all bad"
   - Peak performance: When mainstream consensus is detectable

5. **Pattern Interrupt** (Niche, format-dependent)
   - Breaks algorithmic prediction: "Stop scrolling", "You won't believe", "This changes everything"
   - Examples: Visual scarcity, unusual formatting, loud/surprising opens
   - Peak performance: Highly format-dependent (TikTok vs. LinkedIn)

6. **Social Proof** (Consistent, trust-building)
   - Credibility/numbers: "10M people learned this", "Trusted by Fortune 500"
   - Examples: "Harvard researchers found...", "My students earned...", "Warren Buffett once said"
   - Peak performance: B2B and enterprise audiences

### Scoring

Each hook is scored 0-100 based on:

**Pattern performance history (40 points):**
- If agent brain has performance data: use learned average for this pattern
- Otherwise: use population average (from research)

**Topic fit (30 points):**
- Is this pattern historically good for this topic type?
- Does it match pillar_topics?

**Emotional resonance (20 points):**
- Does target_emotion match audience preferences?
- Is it authentic to the topic?

**Freshness (10 points):**
- Has this exact hook been used before?
- Slight penalty for duplicates

### Implementation

```typescript
// src/hook/index.ts
export function generateHooks(topic: Topic, angle: Angle): Hook[] {
  // 1. For each of 6 hook patterns:
  //    a. Generate 1-2 hook variations using pattern template
  //    b. Score hook based on:
  //       - AgentBrain learned performance for this pattern
  //       - Topic fit (matches pillar_topics?)
  //       - Emotional resonance (matches audience_preferences?)
  //    c. Store hook with pattern and score
  // 2. Rank by score descending
  // 3. Return top N (usually 3, one from each top pattern)
}
```

---

## Workflow: SCRIPT

**Goal:** Combine topic + angle + hook into a production-ready outline.

### Format Templates

Each format has a specific structure optimized for that medium:

**Longform (YouTube, Blog, 2-5 min, 180-300 words):**
```
[HOOK - 10 sec]
"[Hook text]. Most people think X, but here's what actually works..."

[OPENING - 20 sec]
"I used to think X. Then I discovered Y. Here's how it changed everything."

[BODY - 2-4 min]
Point 1: [Proof/example]
Point 2: [Counterintuitive insight]
Point 3: [The real secret]

[CLOSING - 10 sec]
"So here's what to do: [action]. And let me know in the comments if this worked for you."
```

**Shortform (TikTok, Reels, <60 sec, 30-60 words):**
```
[HOOK - 2-3 sec]
[Visual/text explosion]

[RAPID DELIVERY - 3-5 sec]
State claim or show transformation

[TWIST - 2-3 sec]
Reveal punchline or proof

[IMPLIED CTA]
(e.g., follow for more, link in bio)
```

**LinkedIn (Professional, 150-200 words):**
```
[HOOK - 1-2 sentences]
Personal anecdote or bold statement

[INSIGHT - 3-4 sentences]
Why this matters + proof point

[ACTION - 1-2 sentences]
What to do next + value proposition

[CTA]
"What's your take? Comment below."
```

### Implementation

```typescript
// src/script/builder.ts
export function buildScript(options: ScriptBuilderOptions): Script {
  // 1. Load format template (longform | shortform | linkedin)
  // 2. Inject:
  //    - Hook text into [HOOK]
  //    - Angle text into [BODY/INSIGHT]
  //    - Topic keywords into [supporting details]
  // 3. Estimate duration based on word count
  // 4. Return complete Script object
}
```

---

## Workflow: ANALYZE

**Goal:** Ingest performance data and improve the agent brain.

### Performance Metrics

After a video is published, collect:

**Required:**
- views: number
- engagement_rate: (likes + comments + shares) / views
- platform: where it was posted

**Optional:**
- click_through_rate: link clicks / views
- conversion_rate: conversions / views
- hook_performance: 0-100 score of how well the hook grabbed attention (manual or inferred from first-3-second view retention)

### Learning Algorithm

When a performance metric is recorded:

1. **Store:** Add to AgentBrain.performance_history
2. **Analyze:** Extract patterns:
   - Which hook patterns performed best for this audience?
   - Which angle types drive engagement?
   - Which platforms convert best?
   - Which time-of-day / day-of-week performs best?
3. **Update:** Recalculate AgentBrain.learned_patterns
4. **Improve:** Next time you run discover/angle/hook, use improved weights

### Implementation

```typescript
// src/analyze/index.ts
export async function recordPerformance(options: AnalyzeOptions): Promise<PerformanceMetric> {
  // 1. Validate metrics
  // 2. Store in agent brain performance_history
  // 3. Call analyzePatterns()
  // 4. Update agent brain learned_patterns
  // 5. Return metric
}

export function analyzePatterns(agentBrain: AgentBrain): {
  best_hook_patterns: string[];
  best_platforms: string[];
  // ...
} {
  // 1. Group performance_history by hook_pattern, platform, etc.
  // 2. Calculate average engagement_rate for each group
  // 3. Rank by average engagement
  // 4. Return rankings
}
```

---

## Plugin Architecture

### Discovery Source Plugin

Add a new source for topic discovery:

```typescript
// src/discover/my-custom-source.ts
import { Topic } from '../types';

export interface DiscoverSource {
  discover(keywords: string[]): Promise<Topic[]>;
}

export class MyCustomSource implements DiscoverSource {
  async discover(keywords: string[]): Promise<Topic[]> {
    // 1. Connect to your data source
    // 2. Fetch topics matching keywords
    // 3. Score each by trend/competition/relevance
    // 4. Return Topic[]
    return [];
  }
}

// Register in src/discover/index.ts
const sources: Record<string, DiscoverSource> = {
  youtube: new YouTubeSource(),
  reddit: new RedditSource(),
  'my-custom-source': new MyCustomSource(), // ← Your plugin
};
```

### Analytics Backend Plugin

Store performance data to your backend:

```typescript
// src/analyze/my-backend.ts
export interface AnalyticsBackend {
  store(metric: PerformanceMetric): Promise<void>;
  retrieve(script_id: string): Promise<PerformanceMetric[]>;
}

export class MyBackend implements AnalyticsBackend {
  async store(metric: PerformanceMetric): Promise<void> {
    // Save to database, file, or API
  }

  async retrieve(script_id: string): Promise<PerformanceMetric[]> {
    // Load from database, file, or API
    return [];
  }
}
```

---

## Platform Agnosticity

**Design principle:** Viral Flow works with ANY platform, ANY format, ANY audience.

- **No hard-coded platform names** — All references use strings ("youtube", "tiktok", etc.)
- **No format assumptions** — Templates are extensible (add custom formats via plugin)
- **No API lock-in** — Discovery sources are pluggable
- **No data model lock-in** — All data is JSON-serializable; export/import anywhere

This means:
- Add YouTube Shorts? Add a source + update format templates.
- Add Threads? Add a platform + update posting workflow.
- Use custom data backend? Implement AnalyticsBackend interface.

---

## Future Extensibility (Roadmap)

**Phase 2:**
- Multi-account management (manage 10 YouTube channels, 5 TikTok accounts, etc.)
- Series management (group videos by theme/season)
- Scheduled automation (post at optimal times per platform)

**Phase 3:**
- Real-time platform integrations (post directly to YouTube, TikTok, etc.)
- A/B testing framework (test hook variations, angle variations, etc.)
- Audience segmentation (different strategies for different audience segments)

**Phase 4:**
- Web UI dashboard (visual topic browser, angle generator, performance charts)
- Collaborative features (share scripts, angles, hooks with team)
- Marketplace (sell high-performing scripts or angles to other creators)

---

**End of Architecture Document**
