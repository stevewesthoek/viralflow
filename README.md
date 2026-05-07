# Viral Flow

**Platform-agnostic content discovery, angle generation, and performance analytics system**

Viral Flow helps creators, agencies, and consultants discover trending topics, generate compelling content angles, craft attention-grabbing hooks, and learn from performance data. It's the **strategy layer** for content production pipelines.

## What Viral Flow Does

✅ **Discover** trending topics from multiple sources (YouTube, Reddit, custom)  
✅ **Generate** 15 unique angles per topic using the Contrast Formula  
✅ **Score** hook patterns based on copywriting research and your performance data  
✅ **Build** complete scripts from topics, angles, and hooks  
✅ **Analyze** video performance and extract patterns for continuous improvement  
✅ **Learn** — Your agent brain improves over time based on what actually works for your audience  

## What Viral Flow Is NOT

❌ Not a video production tool (use `/video` orchestrator instead)  
❌ Not a hosting platform (publish videos yourself or integrate with posting automation)  
❌ Not a clickbait generator (focuses on authentic, valuable content angles)  
❌ Not AI-dependent (uses research-backed copywriting principles, AI-optional for enhancement)

## Quick Start

### Installation

```bash
npm install viralflow
```

Or clone and build from source:

```bash
git clone https://github.com/stevewesthoek/viralflow.git
cd viralflow
npm install
npm run build
```

### First 5 Minutes

```typescript
import { discover, generateAngles, generateHooks, buildScript } from 'viralflow';

// 1. Discover trending topics
const topics = await discover({
  sources: ['youtube', 'reddit'],
  keywords: ['AI'],
  max_results: 5,
});

// 2. Generate 15 angles from the top topic
const angles = generateAngles({
  topic: topics[0],
  formats: ['longform', 'shortform'],
});

// 3. Generate hooks using proven patterns
const hooks = generateHooks({
  topic: topics[0],
  angle: angles[0],
  num_hooks: 3,
});

// 4. Build a complete script
const script = buildScript({
  topic: topics[0],
  angle: angles[0],
  hook: hooks[0],
  format: 'longform',
  duration: 300, // seconds
});

console.log(script);
```

## Core Workflows

### 1. Discover
Find trending topics relevant to your audience.

**Supported sources:**
- YouTube (via YouTube Data API v3)
- Reddit (via Reddit API)
- Custom (user-defined topics)

**Extensible:** Add your own discovery sources via the plugin architecture.

### 2. Angle
Generate 15 distinct angles using the Contrast Formula: (Old Belief/Problem) → (New Insight/Solution).

**5 angles per format:**
- **Longform** (YouTube, blogs) — myth-busting, method comparison, status-quo challenges
- **Shortform** (TikTok, Reels) — rapid transformation, trend twists, surprising facts
- **LinkedIn** (professional) — career advice reversals, industry insights, skill gaps

### 3. Hook
Score and generate hooks using 6 research-backed patterns:

1. **Curiosity Gap** — "This one weird trick..."
2. **Fear/Urgency** — "If you don't do this by Friday..."
3. **Benefit-Driven** — "Learn how to [solve problem]"
4. **Contrarian** — "Everyone's wrong about X"
5. **Pattern Interrupt** — "Stop scrolling. Here's something different"
6. **Social Proof** — "10M people learned this"

### 4. Script
Combine topic + angle + hook into a complete script outline.

**Formats:**
- Longform (180-300 words, 2-5 minutes)
- Shortform (30-60 words, <60 seconds)
- LinkedIn (150-200 words, professional tone)

### 5. Analyze
Track video performance metrics and let your agent brain learn patterns.

**Metrics:**
- Views
- Engagement rate (likes + comments + shares / views)
- Click-through rate (optional)
- Conversion rate (optional)

Your agent learns which hooks, angles, and platforms perform best for YOUR audience.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Viral Flow: Content Discovery & Strategy Platform      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  INPUT (Topics)                                          │
│       ↓                                                  │
│  ┌──────────────────┐                                   │
│  │ 1. DISCOVER      │ ← Find topics from sources         │
│  │   Topics         │                                    │
│  └────────┬─────────┘                                   │
│           ↓                                              │
│  ┌──────────────────┐                                   │
│  │ 2. ANGLE         │ ← Contrast Formula (15 angles)    │
│  │   Angles         │                                    │
│  └────────┬─────────┘                                   │
│           ↓                                              │
│  ┌──────────────────┐                                   │
│  │ 3. HOOK          │ ← 6 copywriting patterns          │
│  │   Hooks          │                                    │
│  └────────┬─────────┘                                   │
│           ↓                                              │
│  ┌──────────────────┐                                   │
│  │ 4. SCRIPT        │ ← Build complete script           │
│  │   Scripts        │                                    │
│  └────────┬─────────┘                                   │
│           ↓                                              │
│  OUTPUT (Scripts ready for production)                  │
│           ↓                                              │
│  [Pass to video production orchestrator (/video)]       │
│           ↓                                              │
│  [Videos posted & performance tracked]                  │
│           ↓                                              │
│  ┌──────────────────┐                                   │
│  │ 5. ANALYZE       │ ← Performance metrics              │
│  │   Agent Brain    │   (learns patterns)               │
│  └────────┬─────────┘                                   │
│           ↓                                              │
│  [Loop back to DISCOVER with improved insights]         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Installation & Setup

### Requirements
- Node.js 18+
- npm 8+

### Development Setup

```bash
# Clone repo
git clone https://github.com/stevewesthoek/viralflow.git
cd viralflow

# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Build TypeScript
npm run build

# Watch mode (during development)
npm run test:watch
```

## Configuration

Create a `.env` file for API credentials:

```
YOUTUBE_API_KEY=your_key_here
REDDIT_CLIENT_ID=your_id_here
REDDIT_CLIENT_SECRET=your_secret_here
```

## Plugin Architecture

Add custom discovery sources:

```typescript
// src/discover/custom-source.ts
import { DiscoverSource } from './types';

export class MyCustomSource implements DiscoverSource {
  async discover(keywords: string[]): Promise<Topic[]> {
    // Your custom discovery logic
    return [];
  }
}
```

Then register in `discover()` function and use:

```typescript
const topics = await discover({
  sources: ['youtube', 'reddit', 'my-custom-source'],
});
```

## CLI Usage

```bash
# Discover topics
viral-flow discover --keywords "AI" --sources youtube,reddit --max 10

# Generate angles
viral-flow angle --topic-id "topic-123" --formats longform,shortform

# Generate hooks
viral-flow hook --topic-id "topic-123" --angle-id "angle-456"

# Build scripts
viral-flow script --topic-id "topic-123" --angle-id "angle-456" --hook-id "hook-789"

# Analyze performance
viral-flow analyze --script-id "script-000" --views 5000 --engagement-rate 0.12

# Update agent brain
viral-flow brain --action update --performance-data "path/to/data.json"
```

## Examples

See `examples/` directory for real-world usage patterns:
- YouTube educational channel discovery workflow
- TikTok creator rapid-fire content generation
- LinkedIn thought leader content strategy

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design and extensibility
- [docs/API.md](./docs/API.md) — Complete API reference
- [docs/EXAMPLES.md](./docs/EXAMPLES.md) — Real-world usage scenarios
- [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) — How to contribute

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Target Coverage:** 80%+ across all modules

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for:
- How to report bugs
- How to suggest features
- How to submit pull requests
- Coding standards and review process

## Roadmap

**v0.1.0** (Current) — Core workflows: discover, angle, hook, script, analyze  
**v0.2.0** (May 28) — Agent brain: trainable model, feedback loops  
**v0.3.0** (Jun 10) — Multi-account & platform routing  
**v0.4.0** (Jul 1) — Community release: comprehensive docs, examples, contributor onboarding  

[Full roadmap in IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

## License

MIT License — See [LICENSE](./LICENSE) for details

## Author

Built by **Steve Westhoek** — [@stevewesthoek](https://twitter.com/stevewesthoek)

---

**Questions?** Open an issue on GitHub or reach out on Twitter.
