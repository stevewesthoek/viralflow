# Examples

**Real-world usage patterns for Viral Flow**

## Example 1: YouTube Educational Creator

Goal: Produce 5 videos about "AI for creators" this month

```typescript
import { discover, generateAngles, generateHooks, buildScript } from 'viralflow';

// 1. Discover trending topics in your niche
const topics = await discover({
  sources: ['youtube'],
  keywords: ['AI', 'content creation', 'automation'],
  icp_filter: 'content creators earning 6 figures',
  max_results: 5,
});

console.log('Found topics:', topics.map(t => t.title));
// Output:
// - "How AI is replacing video editors"
// - "ChatGPT for script writing"
// - "Automating YouTube uploads"
// - ...

// 2. Pick the top topic and generate angles
const topic = topics[0]; // "How AI is replacing video editors"

const angles = generateAngles({
  topic,
  formats: ['longform'],
  num_angles: 15,
});

console.log('Generated angles:');
angles.forEach((a, i) => console.log(`${i+1}. ${a.angle_text}`));

// 3. Generate hooks for the best angle
const bestAngle = angles[0]; // Highest relevance score
const hooks = generateHooks({ topic, angle: bestAngle });

console.log('Top 3 hooks:');
hooks.forEach((h, i) => console.log(`${i+1}. ${h.text}`));

// 4. Build the complete script
const script = buildScript({
  topic,
  angle: bestAngle,
  hook: hooks[0],
  format: 'longform',
  duration: 300, // 5 minutes
});

console.log('Script ready for production:');
console.log(script.content);

// 5. Produce video (using your video production tool)
// - Record voiceover
// - Add graphics
// - Export MP4
// - Post to YouTube

// 6. After publishing, record performance
recordPerformance({
  script_id: script.id,
  metrics: {
    platform: 'youtube',
    views: 12500,
    engagement_rate: 0.14,
  },
});
```

## Example 2: TikTok Creator Rapid Content

Goal: Generate 10 short-form video scripts in 30 minutes

```typescript
import { discover, generateAngles, generateHooks, buildScript } from 'viralflow';

// 1. Get trending topics fast
const topics = await discover({
  sources: ['tiktok-trending'],
  keywords: ['productivity', 'hacks'],
  max_results: 10,
});

// 2. Generate scripts from all topics
const scripts = topics.flatMap(topic => {
  const angles = generateAngles({
    topic,
    formats: ['shortform'],
    num_angles: 3,
  });

  // Pick best angle and hook
  const angle = angles[0];
  const hooks = generateHooks({ topic, angle, num_hooks: 1 });

  return buildScript({
    topic,
    angle,
    hook: hooks[0],
    format: 'shortform',
    duration: 45,
  });
});

console.log(`Generated ${scripts.length} short-form scripts`);

// 3. Batch production
scripts.forEach(script => {
  // Quick voiceover (use TTS)
  // Quick video edit
  // Post immediately
});
```

## Example 3: LinkedIn Thought Leader

Goal: Build authority with consistent, high-value posts

```typescript
import { discover, generateAngles, generateHooks, buildScript, recordPerformance } from 'viralflow';

async function publishLinkedInPost(script) {
  // POST to LinkedIn
  // ... (integrate with LinkedIn API)
  // Track engagement after 24 hours
  await recordPerformance({
    script_id: script.id,
    metrics: {
      platform: 'linkedin',
      views: 2500,
      engagement_rate: 0.18,
      click_through_rate: 0.05,
    },
  });
}

// Weekly content planning
const topics = await discover({
  sources: ['linkedin_insights', 'reddit'],
  keywords: ['engineering', 'career'],
  icp_filter: 'software engineers looking to lead',
  max_results: 5,
});

// Generate professional angles
const scripts = topics.map(topic => {
  const angles = generateAngles({
    topic,
    formats: ['linkedin'],
    num_angles: 3,
  });

  const hooks = generateHooks({
    topic,
    angle: angles[0],
    num_hooks: 1,
  });

  return buildScript({
    topic,
    angle: angles[0],
    hook: hooks[0],
    format: 'linkedin',
    duration: 120, // ~200 words
  });
});

// Schedule throughout the week
scripts.forEach((script, i) => {
  setTimeout(() => publishLinkedInPost(script), i * 86400000); // 1 day apart
});
```

## Example 4: Agent Brain Learning

Goal: Improve your content strategy based on performance data

```typescript
import { AgentBrain, recordPerformance, analyzePatterns } from 'viralflow';

// Initialize agent brain
let agentBrain: AgentBrain = {
  icp: 'Content creators earning 6-7 figures',
  pillar_topics: ['AI automation', 'personal branding', 'monetization'],
  learned_patterns: {
    best_hook_patterns: [],
    best_angles: [],
    best_platforms: [],
    audience_preferences: {},
  },
  performance_history: [],
  last_updated: new Date().toISOString(),
};

// After 10 videos are published, record their performance
const videos = [
  { id: 'script-001', platform: 'tiktok', views: 50000, engagement: 0.15 },
  { id: 'script-002', platform: 'youtube', views: 12000, engagement: 0.08 },
  { id: 'script-003', platform: 'tiktok', views: 75000, engagement: 0.18 },
  // ... 7 more
];

for (const video of videos) {
  const metric = await recordPerformance({
    script_id: video.id,
    metrics: {
      platform: video.platform,
      views: video.views,
      engagement_rate: video.engagement,
    },
  });
  
  agentBrain.performance_history.push(metric);
}

// Analyze patterns
const patterns = analyzePatterns(agentBrain);

console.log('Your best-performing hook patterns:');
console.log(patterns.best_hook_patterns);
// Output: ['contrarian', 'curiosity_gap', 'social_proof']

console.log('Your best-performing platform:');
console.log(patterns.best_platforms);
// Output: ['tiktok', 'youtube_shorts', 'instagram_reels']

console.log('Recommendation: Focus on contrarian hooks on TikTok');

// Next discovery run will use these learned patterns
// to suggest higher-quality topics and angles
```

## Example 5: Custom Discovery Source

Goal: Discover topics from your proprietary database

```typescript
import { DiscoverSource, Topic } from 'viralflow';

class MyCustomSource implements DiscoverSource {
  async discover(keywords: string[]): Promise<Topic[]> {
    // Query your database
    const results = await myDatabase.query({
      keywords,
      type: 'trending_topics',
    });

    // Convert to Topic format
    return results.map(r => ({
      id: generateId('topic'),
      title: r.title,
      keywords: r.tags,
      description: r.description,
      source: 'my-custom-source',
      trend_score: r.trend_index,
      competition_score: r.saturation_score,
      relevance_score: r.fit_for_audience,
      created_at: new Date().toISOString(),
      metadata: { custom_id: r.id },
    }));
  }
}

// Use it
const topics = await discover({
  sources: ['youtube', 'reddit', 'my-custom-source'],
  keywords: ['AI'],
});

// You now have topics from all 3 sources combined
```

---

**Need more examples?** Open an issue on GitHub or check the [API Reference](./API.md).
