# Viral Flow

> **The missing layer between content strategy and production.** Discover trending topics, generate proven angles, craft compelling hooks, and learn what actually works—all in one platform-agnostic system.

[![npm version](https://img.shields.io/npm/v/viralflow.svg)](https://www.npmjs.com/package/viralflow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-107%20Passing-brightgreen.svg)](./tests/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)](./tsconfig.json)
![Active Development](https://img.shields.io/badge/Status-Active%20Development-success)

---

## 🚀 What Is Viral Flow?

Viral Flow is a **research-backed content strategy engine** that helps creators, agencies, and consultants move from "what should I create?" to "here's exactly what works for my audience in 5 minutes."

It's not AI magic. It's **proven frameworks** (Contrast Formula for angles, 6 copywriting hook patterns) + **your performance data** (agent brain that learns what works) + **multiple sources** (YouTube, Reddit, custom) = a systematic way to create high-performing content.

**The killer feature?** Your agent brain learns from every video you post. Hooks that performed 88% better get recommended more. Platforms that drove 2.1x engagement get prioritized. Patterns that work for YOUR audience compound over time.

---

## 💡 The Problem It Solves

**Before Viral Flow:**
- ❌ Creators spend hours researching trends on YouTube/TikTok manually
- ❌ Writing hooks is guesswork (spray and pray)
- ❌ Analytics are collected but never actioned
- ❌ No systematic way to improve content over time
- ❌ Different tools for discovery, scripting, posting, analytics
- ❌ Hard to scale from 1 video/week to 10/week without chaos

**With Viral Flow:**
- ✅ Discover trending topics in 30 seconds
- ✅ Generate 15 unique angles automatically using the Contrast Formula
- ✅ Score hooks based on research + your actual performance data
- ✅ Build complete scripts from topics → angles → hooks
- ✅ Feed performance metrics back in—agent brain learns what works
- ✅ Scale from 1 video to 100 videos while improving quality
- ✅ Platform-agnostic: YouTube, TikTok, Instagram, LinkedIn, Bluesky, X, all the same workflow

---

## ⚡ Why Viral Flow Is Different

| Feature | Viral Flow | Typical Tools |
|---------|-----------|---|
| **Discovery** | YouTube + Reddit + custom sources | Single platform |
| **Angle Generation** | 15 unique angles via Contrast Formula | Manual brainstorm |
| **Hook Scoring** | Research-backed patterns + your data | Template library |
| **Learning** | Agent brain improves from performance data | One-off analytics |
| **Integration** | Works with ANY video production pipeline | Walled garden |
| **Scalability** | Batch operations, rate limiting, checkpoint/resume | One video at a time |
| **Extensibility** | Plugin architecture for custom sources | Not extensible |
| **Open Source** | MIT licensed, actively maintained | Closed/SaaS |

---

## 🎯 Core Workflows

### 1. **DISCOVER** — Find What's Hot

```typescript
import { discover } from 'viralflow';

const topics = await discover({
  sources: ['youtube', 'reddit'],
  keywords: ['AI automation'],
  icp_filter: 'B2B SaaS founders',
  max_results: 5,
});

// Returns: trending topics ranked by composite score
// (trend_score × 0.5 + competition × 0.3 + ICP_fit × 0.2)
```

**Why this matters:** Instead of scrolling TikTok for 30 minutes, you get 5 verified trends in 30 seconds. Ranked by what's actually trending + how crowded it is + fit to your audience.

---

### 2. **ANGLE** — Contrast Formula

```typescript
import { generateAngles } from 'viralflow';

const angles = generateAngles({
  topic: topics[0],
  formats: ['longform', 'shortform', 'linkedin'],
  num_angles: 15,
});

// Returns 15 angles using Contrast Formula:
// Old belief/problem → New insight/solution
```

**Why this matters:** The Contrast Formula isn't new, but it's **underused**. Juxtaposing what people think vs. reality creates immediate curiosity. 5 angles per format (longform, shortform, LinkedIn) = 15 starting points for content.

**Example angle:**
- **Old:** "You need to learn coding to build AI products"
- **New:** "No-code AI tools are shipping products faster than engineers"
- **Contrast pair:** That's your angle. Your audience will stop scrolling.

---

### 3. **HOOK** — 6 Research-Backed Patterns

```typescript
import { generateHooks } from 'viralflow';

const hooks = generateHooks({
  topic: topics[0],
  angle: angles[0],
  num_hooks: 3,
});

// Returns hooks scored 0-100 based on:
// - Base pattern effectiveness (copywriting research)
// - Agent brain learning (what worked for YOUR audience)
// - Emotional resonance (curiosity, fear, benefit, etc.)
// - Topic fit
```

**The 6 patterns:**
1. **Curiosity Gap** — "This one thing changed everything"
2. **Fear/Urgency** — "If you're not doing this by next month..."
3. **Benefit** — "Learn how to 10x your productivity"
4. **Contrarian** — "Everyone's wrong about this"
5. **Pattern Interrupt** — "Stop. This will surprise you"
6. **Social Proof** — "10M people already know this"

**Why this matters:** You're not guessing hooks. You're using patterns that worked on millions of videos + data from YOUR uploads. The agent brain tracks which patterns performed best (88% higher engagement, 2.1x CTR, etc.) and recommends them more.

---

### 4. **SCRIPT** — From Hook to Full Script

```typescript
import { buildScript } from 'viralflow';

const script = buildScript({
  topic: topics[0],
  angle: angles[0],
  hook: hooks[0],
  format: 'longform', // or 'shortform', 'linkedin'
  duration: 300, // seconds
});

// Returns production-ready script with:
// - Hook → body → call-to-action
// - Estimated duration
// - Key talking points
// - Format-specific tweaks (YouTube vs TikTok vs LinkedIn)
```

**Why this matters:** You go from "I have a trending topic" to "Here's my 5-minute YouTube script" in one function call. No blank page syndrome. The template gives you structure; you fill in authenticity.

---

### 5. **ANALYZE** — Your Agent Learns

```typescript
import { recordPerformance } from 'viralflow';

await recordPerformance({
  script_id: 'script-001',
  metrics: {
    platform: 'youtube',
    views: 45000,
    engagement_rate: 0.12,
    click_through_rate: 0.08,
  },
}, agentBrain);

// Agent brain now knows:
// - This hook pattern performs 12% engagement on YouTube
// - This angle drives 45k views
// - Your audience prefers contrarian hooks on this platform
```

**Why this matters:** Most tools collect analytics. Viral Flow **acts on them**. Every video you upload makes the system smarter. No manual tuning. No ML expertise needed. Just record what happened, and the agent brain learns patterns automatically.

---

## 📦 Installation

### Via npm (when published)

```bash
npm install viralflow
```

### From Source

```bash
git clone https://github.com/stevewesthoek/viralflow.git
cd viralflow
npm install
npm run build
npm test
```

---

## 🎬 Quick Start (5 Minutes)

```typescript
import {
  discover,
  generateAngles,
  generateHooks,
  buildScript,
  recordPerformance,
  BrainManager,
} from 'viralflow';

// 1. Discover trending topics
const topics = await discover({
  sources: ['youtube', 'reddit'],
  keywords: ['AI automation for creators'],
  max_results: 5,
});

console.log('📍 Found topics:', topics.map(t => t.title));

// 2. Generate 15 angles for the top topic
const angles = await generateAngles({
  topic: topics[0],
  formats: ['longform', 'shortform', 'linkedin'],
  num_angles: 15,
});

console.log('💡 Generated', angles.length, 'angles');

// 3. Generate hooks using proven patterns
const hooks = await generateHooks({
  topic: topics[0],
  angle: angles[0],
  num_hooks: 3,
});

console.log('🎣 Top hook:', hooks[0].text, `(${hooks[0].pattern})`);

// 4. Build a complete script
const script = await buildScript({
  topic: topics[0],
  angle: angles[0],
  hook: hooks[0],
  format: 'longform',
  duration: 300,
});

console.log('📝 Script ready:', script.title);
console.log(script.content);

// 5. After you post the video, record performance
// (This is where the agent brain learns)
const brain = new BrainManager();
await brain.recordMetric({
  script_id: script.id,
  platform: 'youtube',
  views: 12500,
  engagement_rate: 0.15,
});

console.log('🧠 Agent brain learned from your video!');
```

**Output:**
```
📍 Found topics: [
  "AI automation tools reducing human work by 80%",
  "No-code AI replacing junior developers",
  "AI safety concerns in enterprise"
]

💡 Generated 15 angles

🎣 Top hook: "Everyone's automating wrong. Here's what actually works" (contrarian)

📝 Script ready: "Why 90% of Automation Fails (And How To Fix It)"

🧠 Agent brain learned from your video!
```

Done. You now have the infrastructure to scale from 1 video/week to 10 videos/week **with improving quality over time**.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│         VIRAL FLOW: Content Strategy Engine                │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  INPUT (Raw idea or topic keyword)                          │
│        ↓                                                    │
│  ┌──────────────────────────────────────────┐              │
│  │ DISCOVER LAYER                           │              │
│  │ ✓ YouTube trending                       │              │
│  │ ✓ Reddit hot posts                       │              │
│  │ ✓ Custom sources (extensible)            │              │
│  │ → Output: 5 ranked topics                │              │
│  └────────────┬─────────────────────────────┘              │
│               ↓                                              │
│  ┌──────────────────────────────────────────┐              │
│  │ ANGLE LAYER (Contrast Formula)           │              │
│  │ ✓ 5 angles per format                    │              │
│  │ ✓ 3 formats (longform/shortform/LinkedIn)│              │
│  │ → Output: 15 unique angles               │              │
│  └────────────┬─────────────────────────────┘              │
│               ↓                                              │
│  ┌──────────────────────────────────────────┐              │
│  │ HOOK LAYER (6 Copywriting Patterns)      │              │
│  │ ✓ Curiosity gap / Fear / Benefit         │              │
│  │ ✓ Contrarian / Pattern interrupt / Proof │              │
│  │ ✓ Scored 0-100 by research + your data   │              │
│  │ → Output: 3 scored hooks                 │              │
│  └────────────┬─────────────────────────────┘              │
│               ↓                                              │
│  ┌──────────────────────────────────────────┐              │
│  │ SCRIPT LAYER (Template Generation)       │              │
│  │ ✓ Format-specific (16:9 / 9:16 / 1:1)   │              │
│  │ ✓ Duration-aware                         │              │
│  │ → Output: Production-ready script        │              │
│  └────────────┬─────────────────────────────┘              │
│               ↓                                              │
│  [POST VIDEO TO PLATFORM]                                 │
│               ↓                                              │
│  ┌──────────────────────────────────────────┐              │
│  │ AGENT BRAIN LAYER (Learning)             │              │
│  │ ✓ Track performance metrics              │              │
│  │ ✓ Rank hook patterns by effectiveness    │              │
│  │ ✓ Analyze platform performance           │              │
│  │ ✓ Infer audience preferences             │              │
│  │ → Confidence scores improve with data    │              │
│  └────────────┬─────────────────────────────┘              │
│               ↓                                              │
│  [LOOP: Improved recommendations next time]               │
│               ↓                                              │
│  OUTPUT (Continuously improving content strategy)          │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 The Numbers

- **107 tests** — All passing, strict TypeScript mode
- **4,500 lines** of production code + comprehensive test suite
- **8 platform strategies** built-in (YouTube, TikTok, Instagram, LinkedIn, Facebook, Bluesky, X, Custom)
- **15 unique angles** per topic via Contrast Formula
- **6 copywriting patterns** with research backing
- **Confidence scoring** (0-1 scale) improves with data
- **Zero external dependencies** for core algorithms (bring your own APIs)

---

## 🔌 Platform Integration

Viral Flow integrates seamlessly into **any content production pipeline**:

- **Video Orchestrator** (`/video`) — Receives scripts → handles post-production
- **STB Pipeline** — Narrated slideshow automation
- **ffmpeg Integration** — Audio mixing, video composition
- **n8n Webhooks** — Automated social posting
- **Posting Orchestrator** — Multi-platform simultaneous uploads
- **Claude/Codex/Gemini** — Natural language orchestration via `/goviralbro` skill

You choose which pieces to use. Viral Flow works with your stack, not against it.

---

## 💻 Code Quality

This codebase is **built for teams and contributors**:

### Comprehensive Testing
```typescript
// Every workflow has integration tests
// Discover → Angle → Hook → Script → Analyze → Learning
// 107 passing tests across 10 test files
// 80%+ coverage target
npm test              // Run suite
npm run test:watch    // Watch mode during development
npm run test:coverage // See coverage report
```

### Production-Ready Types
```typescript
// Full TypeScript strict mode
// No implicit any
// All types exported for your own code
import {
  Topic,
  Angle,
  Hook,
  Script,
  PerformanceMetric,
  AgentBrain,
  // ... all types available
} from 'viralflow';
```

### Clear, Documented Functions
```typescript
/**
 * Generate angles using the Contrast Formula.
 * 
 * The Contrast Formula juxtaposes:
 * - Old belief/problem (what people think)
 * - New insight/solution (what's actually true)
 * 
 * This creates immediate curiosity because the contrast
 * signals: "Wait, I need to hear this."
 * 
 * @param topic - The topic to generate angles for
 * @param formats - Content formats to target (longform/shortform/linkedin)
 * @param num_angles - Total angles to generate (default: 15)
 * @returns Array of unique angles with contrast pairs
 */
export async function generateAngles(
  topic: Topic,
  formats: Format[] = ['longform', 'shortform', 'linkedin'],
  num_angles: number = 15
): Promise<Angle[]>
```

### Extensible Architecture
```typescript
// Add your own discovery sources
export interface DiscoverSource {
  discover(keywords: string[]): Promise<Topic[]>;
}

// Or custom hook patterns
export interface HookPattern {
  name: string;
  template: string;
  baseScore: number;
  description: string;
}
```

---

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — System design, data flow, extensibility points
- **[docs/API.md](./docs/API.md)** — Complete API reference with examples
- **[docs/EXAMPLES.md](./docs/EXAMPLES.md)** — Real-world use cases (YouTube channels, TikTok creators, agencies)
- **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)** — How to contribute, coding standards, review process
- **[PHASE_123_COMPLETION.md](./PHASE_123_COMPLETION.md)** — Full implementation report (phases 1–3 complete)

---

## 🧪 Testing & Validation

```bash
# Run all tests
npm test

# Watch mode (great for development)
npm run test:watch

# Coverage report
npm run test:coverage

# Lint check
npm run lint

# Full build
npm run build
```

**Test Coverage Targets:**
- Discover sources: 100%
- Angle generation: 100%
- Hook patterns: 100%
- Script building: 100%
- Performance analysis: 100%
- Agent brain learning: 100%
- Overall: 80%+

---

## 🚀 Roadmap

| Version | Focus | Status |
|---------|-------|--------|
| **v0.1.0** | Core workflows (DISCOVER, ANGLE, HOOK, SCRIPT, ANALYZE) | ✅ **Complete** |
| **v0.2.0** | Agent brain learning with confidence scoring | ✅ **Complete** |
| **v0.3.0** | Multi-account platform routing (8 platforms) | ✅ **Complete** (current) |
| **v0.4.0** | Brain integration + community onboarding | 🚀 **Next** |
| **v1.0.0** | Stable API, npm publication, enterprise support | 📅 Q3 2026 |

---

## 💬 Community & Contribution

**This is an active, maintained project.** We welcome:

- ⭐ **Star it** if you find it useful
- 🍴 **Fork it** to customize for your workflow
- 💬 **Discuss it** — open issues to ask questions, share ideas, propose features
- 🐛 **Report bugs** with exact steps to reproduce
- 🔧 **Submit pull requests** — see [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- 📢 **Share it** with other creators/agencies/teams building content systems
- 📝 **Comment on code** — leave feedback on functions, patterns, architecture
- 🎯 **Suggest integrations** — "Could this work with X tool?" Yes, probably.

**Real use cases help:** If you're using Viral Flow in production, tell us! We'd love to add your story to the docs.

---

## 🎓 Learn More

**New to Viral Flow?**
1. Read this README (you're here! ✓)
2. Run the quick start (copy/paste the 5-minute example above)
3. Check [docs/EXAMPLES.md](./docs/EXAMPLES.md) for real workflows
4. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand how it works

**Want to extend it?**
1. Review [docs/API.md](./docs/API.md) for all functions
2. Look at `src/discover/` to see how sources work
3. Check `src/hook/patterns.ts` to add custom hook patterns
4. See [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines

**Questions?**
- Open a [GitHub Issue](https://github.com/stevewesthoek/viralflow/issues)
- Check existing issues for similar questions
- Read the FAQ in [docs/EXAMPLES.md](./docs/EXAMPLES.md)

---

## 📄 License

MIT — Use freely in personal or commercial projects. See [LICENSE](./LICENSE) for details.

---

## 👤 About

**Viral Flow** is built by **Steve Westhoek**, a content systems architect and open-source maintainer.

This project grew from the realization that most content creators, agencies, and teams have scattered tools for discovery, ideation, scripting, and analytics—and **they never talk to each other**.

Viral Flow is the glue: research-backed frameworks (Contrast Formula, copywriting patterns) + machine learning (agent brain) + extensible architecture = a system that scales from 1 video/week to 100 videos/week while **continuously improving**.

**Why open source?** Because the best content systems are built by communities, not gatekeepers. Your audience is unique. Your metrics are yours. Your workflows deserve to be systematic and data-driven.

This is tool for creators who think like engineers and engineers who think like creators.

---

## 🙏 Support & Feedback

If Viral Flow helps you, please:

1. **⭐ Star this repository** — signals to GitHub that the project is valuable
2. **🔄 Share it** — tweet, mention it in blogs, share with friends
3. **💬 Give feedback** — what works? What's missing? What should we build next?
4. **🐛 Report issues** — bugs are features waiting to be fixed
5. **🔧 Contribute** — see [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

**Happy creating. Happy scaling.**

Made with ❤️ for creators who want data-driven content strategy.

**[GitHub](https://github.com/stevewesthoek/viralflow) • [Issues](https://github.com/stevewesthoek/viralflow/issues) • [Discussions](https://github.com/stevewesthoek/viralflow/discussions)**
