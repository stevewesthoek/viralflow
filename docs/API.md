# API Reference

**Viral Flow v0.1.0 API Documentation**

## Installation

```bash
npm install viralflow
```

## Core Functions (Phase 1)

### discover()

Find trending topics.

```typescript
import { discover } from 'viralflow';

const topics = await discover({
  sources: ['youtube', 'reddit'],
  keywords: ['AI automation'],
  icp_filter: 'content creators', // optional
  max_results: 10,
});
```

**Parameters:**
- `sources` — Array of discovery sources ('youtube', 'reddit', or plugin name)
- `keywords` — Topics to search for
- `icp_filter` — Optional filter by ICP (Ideal Customer Profile)
- `max_results` — Max topics to return (default: 10)

**Returns:** Topic[]

### generateAngles()

Create 15 unique angles from a topic.

```typescript
import { generateAngles } from 'viralflow';

const angles = generateAngles({
  topic,
  formats: ['longform', 'shortform'],
  num_angles: 15, // optional, default
});
```

**Returns:** Angle[]

### generateHooks()

Generate hooks using 6 copywriting patterns.

```typescript
import { generateHooks } from 'viralflow';

const hooks = generateHooks({
  topic,
  angle,
  num_hooks: 3, // optional
});
```

**Returns:** Hook[]

### buildScript()

Create a production-ready script.

```typescript
import { buildScript } from 'viralflow';

const script = buildScript({
  topic,
  angle,
  hook,
  format: 'shortform',
  duration: 45, // seconds, optional
});
```

**Returns:** Script

### recordPerformance()

Track video performance metrics.

```typescript
import { recordPerformance } from 'viralflow';

const metric = await recordPerformance({
  script_id: 'script-abc123',
  metrics: {
    platform: 'tiktok',
    views: 50000,
    engagement_rate: 0.12,
    click_through_rate: 0.08,
    conversion_rate: 0.02,
  },
});
```

**Returns:** PerformanceMetric

## Types

See `src/types.ts` for all TypeScript interfaces.

**Key types:**
- `Topic` — Content idea
- `Angle` — Unique perspective
- `Hook` — Attention-grabbing opening
- `Script` — Production-ready outline
- `PerformanceMetric` — Video performance data
- `AgentBrain` — Learned patterns

## Utility Functions

### generateId()

Create a unique ID with optional prefix.

```typescript
import { generateId } from 'viralflow';

const id = generateId('topic');
// → 'topic-a1b2c3d4e5f6g7h8'
```

### getCurrentTimestamp()

Get current time as ISO string.

```typescript
import { getCurrentTimestamp } from 'viralflow';

const ts = getCurrentTimestamp();
// → '2026-05-07T12:00:00.000Z'
```

### calculateEngagementRate()

Calculate engagement rate from raw numbers.

```typescript
import { calculateEngagementRate } from 'viralflow';

const rate = calculateEngagementRate(
  100,  // likes
  50,   // comments
  25,   // shares
  5000  // views
);
// → 0.035 (3.5%)
```

### scorePerformance()

Score video performance (0-100).

```typescript
import { scorePerformance } from 'viralflow';

const score = scorePerformance({
  views: 50000,
  engagement_rate: 0.12,
  click_through_rate: 0.08,
  conversion_rate: 0.02,
});
// → 87
```

## CLI

### discover command

```bash
viral-flow discover \
  --keywords "AI" "automation" \
  --sources youtube reddit \
  --max 10
```

### angle command

```bash
viral-flow angle \
  --topic-id "topic-abc123" \
  --formats longform shortform
```

### hook command

```bash
viral-flow hook \
  --topic-id "topic-abc123" \
  --angle-id "angle-xyz789"
```

### script command

```bash
viral-flow script \
  --topic-id "topic-abc123" \
  --angle-id "angle-xyz789" \
  --hook-id "hook-def456" \
  --format longform
```

### analyze command

```bash
viral-flow analyze \
  --script-id "script-ghi789" \
  --views 50000 \
  --engagement-rate 0.12
```

## Environment Variables

```bash
# Required for YouTube source
YOUTUBE_API_KEY=your_key_here

# Required for Reddit source
REDDIT_CLIENT_ID=your_id_here
REDDIT_CLIENT_SECRET=your_secret_here
```

## Error Handling

All functions may throw errors. Wrap in try/catch:

```typescript
try {
  const topics = await discover({ ... });
} catch (error) {
  console.error('Discovery failed:', error.message);
}
```

Common errors:
- `Error: Missing YOUTUBE_API_KEY` — YouTube source needs API key
- `Error: Topic not found` — Topic ID doesn't exist
- `Error: Invalid format: xyz` — Format not supported

## Limits

- Max results per discover: 100
- Max angles per topic: 50
- Max hooks per angle: 10
- Performance metrics are unlimited

## Future APIs (Phases 2-4)

- Multi-account management
- Series management
- Scheduled automation
- Real-time platform posting
- A/B testing framework
- Web UI dashboard

---

**Full examples in docs/EXAMPLES.md**
