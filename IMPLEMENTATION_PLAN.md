# Viral Flow — Implementation Plan

**Project:** Open-source, platform-agnostic content discovery & strategy system  
**Owner:** Steve Westhoek  
**Repository:** https://github.com/stevewesthoek/viralflow.git  
**Start Date:** 2026-05-07  
**Target MVP Release:** 2026-05-21 (v0.1.0)

---

## Executive Summary

Viral Flow is a **content discovery, angle generation, and performance analytics system** designed for creators, agencies, and consultants. It's inspired by GoViralBro's methodology but rebuilt ground-up for:
- **Platform agnosticity** — Works with any platform's API
- **Environment agnosticity** — CLI, Node.js library, containerized, or embedded
- **Production readiness** — Full test coverage, comprehensive docs, semantic versioning
- **Extensibility** — Plugin architecture for custom discovery sources and analytics backends

**Non-goal:** Viral Flow is NOT a video production tool. It's the **discovery + strategy layer** that feeds into orchestrators like `/video`.

---

## Roadmap: 5 Phases Over 8 Weeks

### Phase 0: Foundation (Week 1, May 7-13)
- **Goal:** Establish project structure, CI/CD, and core architecture
- **Outputs:** Repo skeleton, package.json, initial docs, GitHub Actions workflows
- **Status:** Planning phase (this document)

### Phase 1: Core Workflows (Week 2-3, May 14-27)
- **Goal:** Implement 5 core workflows: discover, angle, hook, script, analyze
- **Outputs:** MVP with working CLI, 80%+ test coverage, comprehensive API docs
- **Status:** Ready for v0.1.0 release

### Phase 2: Agent Brain (Week 4, May 28-Jun 3)
- **Goal:** Implement trainable agent system (learns from performance data)
- **Outputs:** Feedback loop integration, agent state persistence, learning algorithms
- **Status:** Ready for v0.2.0 release

### Phase 3: Multi-Account & Platform Routing (Week 5, Jun 4-10)
- **Goal:** Support multi-account management and platform-specific strategies
- **Outputs:** Account registry, series management, platform adapters
- **Status:** Ready for v0.3.0 release

### Phase 4: Brain Integration (Week 6, Jun 11-17)
- **Goal:** Integrate Viral Flow into `/video` orchestrator
- **Outputs:** `/goviralbro` skill, DISCOVER phase in `/video`, end-to-end testing
- **Status:** Production ready in brain

### Phase 5: Community & Polish (Week 7-8, Jun 18-01 Jul)
- **Goal:** Documentation, examples, contributor onboarding, feedback incorporation
- **Outputs:** Comprehensive docs, example projects, CONTRIBUTING.md, v0.4.0 release
- **Status:** Open-source ready

---

## Phase 0: Foundation (Week 1)

### Objectives
1. Create production-ready project structure
2. Set up CI/CD and testing infrastructure
3. Write core architecture documentation
4. Establish coding standards and tooling

### Tasks

#### P0.1: Project Structure & Package Setup (2 hours)
- [ ] Initialize `package.json` with project metadata
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Set up folder structure (src/, tests/, docs/, examples/)
- [ ] Add .gitignore, .editorconfig
- [ ] Create base directory stubs

**Files to create:**
```
viralflow/
├── package.json
├── tsconfig.json
├── .gitignore
├── .editorconfig
├── README.md (skeleton)
├── LICENSE (MIT)
├── ARCHITECTURE.md (outline)
├── src/
│   ├── index.ts
│   ├── types.ts
│   └── utils.ts
├── tests/
│   └── setup.ts
├── docs/
│   ├── API.md
│   ├── EXAMPLES.md
│   └── CONTRIBUTING.md
├── examples/
│   └── basic-discovery.js
└── .github/
    └── workflows/
        ├── ci.yml
        ├── release.yml
        └── docs.yml
```

#### P0.2: CI/CD Pipeline (GitHub Actions) (2 hours)
- [ ] Create `ci.yml` workflow (lint, test, coverage)
- [ ] Create `release.yml` workflow (auto-publish to npm on git tag)
- [ ] Set up code coverage reporting (Codecov integration)
- [ ] Configure branch protection rules (main requires passing tests)

**Workflow files:**
- `ci.yml`: runs on every push/PR
  - Install deps
  - Run linter (ESLint)
  - Run tests (Jest, collect coverage)
  - Upload to Codecov
  - Fail if coverage < 80%
- `release.yml`: runs on version tags (v0.1.0, v0.2.0, etc.)
  - Build distribution
  - Publish to npm
  - Create GitHub release

#### P0.3: Testing Infrastructure (1.5 hours)
- [ ] Set up Jest configuration
- [ ] Add TypeScript support for tests
- [ ] Create test utilities and fixtures
- [ ] Write first sanity test (package loads)

**Files:**
- `jest.config.js` — Configure Jest for TypeScript
- `tests/setup.ts` — Global test setup
- `tests/sanity.test.ts` — Package loads successfully

#### P0.4: Architecture & Design Docs (2 hours)
- [ ] Write `ARCHITECTURE.md` (high-level design, data flows, plugin model)
- [ ] Write `API.md` skeleton (placeholder for Phase 1)
- [ ] Write `EXAMPLES.md` skeleton (placeholder for Phase 1)
- [ ] Create `CONTRIBUTING.md` (coding standards, PR process)

**Key sections in ARCHITECTURE.md:**
- System overview (inputs, processors, outputs)
- Data model (topics, angles, hooks, scripts, performance)
- Plugin architecture (how to add custom discovery sources, analytics backends)
- Platform agnosticity (design principles)
- Extensibility roadmap

#### P0.5: Linting & Code Quality Setup (1 hour)
- [ ] Configure ESLint with Airbnb preset
- [ ] Configure Prettier for code formatting
- [ ] Add pre-commit hooks (husky + lint-staged)
- [ ] Add TypeScript strict mode

**Files:**
- `.eslintrc.js`
- `.prettierrc`
- `husky` configuration
- `lint-staged` configuration

#### P0.6: Dependencies & Tooling (1 hour)
- [ ] Add core dependencies:
  - `typescript` — Language
  - `jest` + `@types/jest` — Testing
  - `axios` — HTTP requests (for API calls)
  - `joi` — Schema validation (input/output validation)
  - `dotenv` — Environment variables
  - `winston` — Logging
- [ ] Add dev dependencies:
  - `eslint`, `prettier`, `@typescript-eslint/*` — Code quality
  - `husky`, `lint-staged` — Git hooks
  - `ts-node` — TypeScript execution
- [ ] Create `package-lock.json`

#### P0.7: Initial README & Quick Start (1 hour)
- [ ] Write comprehensive README.md
  - Project overview (what it does, what it's NOT)
  - Quick start (installation, first usage)
  - Core workflows (discover, angle, hook, script, analyze)
  - Architecture diagram (ASCII)
  - Contributing guidelines
  - License

**Phase 0 Total Effort:** ~11 hours  
**Estimated Completion:** May 9, 2026

---

## Phase 1: Core Workflows (Week 2-3)

### Objectives
1. Implement 5 core workflows (discover, angle, hook, script, analyze)
2. Build CLI interface
3. Achieve 80%+ test coverage
4. Write comprehensive API documentation

### Data Model (Foundation for all workflows)

```typescript
// Core types (src/types.ts)
interface Topic {
  id: string;
  title: string;
  keywords: string[];
  description: string;
  source: 'youtube' | 'reddit' | 'custom' | string;
  trend_score: number; // 0-100
  competition_score: number; // 0-100 (higher = more competition)
  relevance_score: number; // 0-100 (to your ICP)
  created_at: string;
  metadata: Record<string, any>;
}

interface Angle {
  id: string;
  topic_id: string;
  angle_text: string;
  format: 'longform' | 'shortform' | 'linkedin'; // or any platform
  contrast_pair: { old: string; new: string }; // Contrast Formula
  target_emotion: 'curiosity' | 'fear' | 'benefit' | 'contrarian' | 'urgency' | 'proof';
  created_at: string;
}

interface Hook {
  id: string;
  text: string;
  pattern: 'curiosity_gap' | 'fear_urgency' | 'benefit' | 'contrarian' | 'pattern_interrupt' | 'social_proof';
  score: number; // 0-100 (predicted performance)
  created_at: string;
}

interface Script {
  id: string;
  topic_id: string;
  angle_id: string;
  hook_id: string;
  title: string;
  content: string; // Full script text
  format: string;
  estimated_duration: number; // seconds
  created_at: string;
}

interface PerformanceMetric {
  id: string;
  script_id: string;
  platform: string;
  views: number;
  engagement_rate: number; // (likes + comments + shares) / views
  click_through_rate: number;
  conversion_rate: number;
  hook_performance: number; // How well the hook performed (0-100)
  recorded_at: string;
}

interface AgentBrain {
  icp: string; // Ideal Customer Profile description
  pillar_topics: string[]; // 3-5 core topics you focus on
  learned_patterns: {
    best_hook_patterns: string[]; // Ranked by performance
    best_angles: string[]; // Common angle types that work
    best_platforms: string[]; // Which platforms drive engagement
    audience_preferences: Record<string, any>;
  };
  performance_history: PerformanceMetric[];
  last_updated: string;
}
```

### Tasks

#### P1.1: Discover Workflow (Discovery API Integration) (8 hours)

**Goal:** Find trending topics relevant to user's ICP

**Supported sources (v0.1.0):**
- YouTube trending (via YouTube Data API v3)
- Reddit trending (via Reddit API)
- Manual input (user-defined topics)

**Extensible design:** Plugins for additional sources (Twitter, TikTok, Hacker News, etc.)

**Files to create:**
- `src/discover/types.ts` — DiscoverSource interface
- `src/discover/youtube.ts` — YouTube discovery plugin
- `src/discover/reddit.ts` — Reddit discovery plugin
- `src/discover/manual.ts` — Manual input plugin
- `src/discover/index.ts` — Orchestrator (router)
- `tests/discover.test.ts` — Full test suite

**Implementation:**

```typescript
// src/discover/index.ts
interface DiscoverOptions {
  sources: ('youtube' | 'reddit' | 'manual')[];
  keywords?: string[];
  icp_filter?: string; // Filter results by ICP relevance
  max_results?: number;
}

export async function discover(options: DiscoverOptions): Promise<Topic[]> {
  // 1. Fetch from requested sources in parallel
  // 2. Score each topic (trend_score, competition_score, relevance_score)
  // 3. Rank and deduplicate
  // 4. Return ranked list
}
```

**Tests to write:**
- [ ] discover() with YouTube source returns valid Topic[]
- [ ] discover() with Reddit source returns valid Topic[]
- [ ] discover() with manual source accepts user input
- [ ] discover() ranks topics by trend_score
- [ ] discover() deduplicates topics from multiple sources
- [ ] discover() filters by ICP if provided
- [ ] discover() respects max_results limit
- [ ] discover() handles API errors gracefully (mock API failures)

**Phase 1.1 Effort:** ~8 hours

#### P1.2: Angle Workflow (Contrast Formula) (6 hours)

**Goal:** Generate 15 angles from a topic using the Contrast Formula

**Contrast Formula:** (Old Belief, Problem, or Status Quo) → (New Insight, Opportunity, or Better Way)

**Implementation:**

```typescript
// src/angle/index.ts
interface AngleGeneratorOptions {
  topic: Topic;
  formats: ('longform' | 'shortform' | 'linkedin')[];
  num_angles?: number; // Default 15
}

export function generateAngles(options: AngleGeneratorOptions): Angle[] {
  // 1. Parse topic title and keywords
  // 2. Generate contrasts (old vs new, problem vs solution, etc.)
  // 3. Create 5 angles per format (5 unique contrasts)
  // 4. Assign target_emotion to each
  // 5. Return ranked by predicted performance
}
```

**Contrast patterns (15 total, 5 per format):**

_Longform (YouTube, blog):_
1. Myth vs. Reality — "Everyone thinks X, but actually Y"
2. Problem vs. Solution — "Most people fail at X, here's how to win"
3. Old Method vs. New Method — "Stop doing X, do this instead"
4. Misconception vs. Truth — "You've been told X is good; it's actually terrible"
5. Status Quo vs. Opportunity — "While everyone does X, winners are doing Y"

_Shortform (TikTok, Reels, Shorts):_
1. Curiosity Hook — "Wait till the end to see why X is actually Y"
2. Rapid Transformation — "X to Y in 60 seconds"
3. Trend Twist — "Everyone's doing X wrong, here's the right way"
4. Bold Claim — "If you still believe X, you're behind"
5. Surprising Fact — "X is actually Y (and here's proof)"

_LinkedIn (Professional):_
1. Career Advice Reversal — "Stop following advice about X; do Y instead"
2. Industry Insight — "Nobody's talking about X, but it's the future"
3. Skill Gap — "Companies are paying for X skill, but nobody teaches it"
4. Opportunity — "By 2026, X will be obsolete; start learning Y now"
5. Leadership Shift — "The best leaders aren't doing X anymore; here's why"

**Files:**
- `src/angle/contrast-formula.ts` — Core angle generation
- `src/angle/patterns.ts` — 15 contrast patterns (data)
- `src/angle/index.ts` — Public API
- `tests/angle.test.ts` — Full test suite

**Tests:**
- [ ] generateAngles() creates 15 angles for 3 formats (5 per format)
- [ ] Each angle has target_emotion assigned
- [ ] Each angle has contrast_pair (old/new)
- [ ] Angles are diverse (no duplicates)
- [ ] Format filtering works (longform returns only 5)
- [ ] Custom num_angles parameter works

**Phase 1.2 Effort:** ~6 hours

#### P1.3: Hook Workflow (6 Hook Patterns + Scoring) (6 hours)

**Goal:** Generate compelling hooks and score them for predicted performance

**6 Hook Patterns (from copywriting research):**
1. **Curiosity Gap** — "This one weird trick..." (creates information gap)
2. **Fear/Urgency** — "If you don't do this by Friday..." (scarcity/deadline)
3. **Benefit-Driven** — "Learn how to [solve problem]" (direct value)
4. **Contrarian** — "Everyone's wrong about X" (challenge status quo)
5. **Pattern Interrupt** — "Stop scrolling. Here's something different" (attention grab)
6. **Social Proof** — "10M people learned this" (credibility)

**Implementation:**

```typescript
// src/hook/index.ts
interface HookGeneratorOptions {
  topic: Topic;
  angle: Angle;
  num_hooks?: number; // Default 3
}

export function generateHooks(options: HookGeneratorOptions): Hook[] {
  // 1. For each of 6 patterns, generate 1-2 hook variations
  // 2. Score each hook (0-100) based on:
  //    - Pattern effectiveness (learned from agent brain)
  //    - Topic trend_score
  //    - Angle compatibility
  //    - Emotional trigger strength
  // 3. Return top N ranked by score
}

export function scoreHook(hook: Hook, context?: { agentBrain?: AgentBrain }): number {
  // Calculate hook score (0-100)
  // Factors: pattern performance history, emotional resonance, topic fit
}
```

**Files:**
- `src/hook/patterns.ts` — 6 hook pattern templates
- `src/hook/scoring.ts` — Hook scoring algorithm
- `src/hook/index.ts` — Public API
- `tests/hook.test.ts` — Full test suite

**Tests:**
- [ ] generateHooks() creates hooks across 6 patterns
- [ ] Each hook has pattern field
- [ ] Each hook has score (0-100)
- [ ] scoreHook() returns higher score for proven patterns
- [ ] scoreHook() contextualizes on agent brain history
- [ ] Custom num_hooks parameter works

**Phase 1.3 Effort:** ~6 hours

#### P1.4: Script Workflow (Script Builder) (5 hours)

**Goal:** Combine hook + angle + topic into a script outline

**Implementation:**

```typescript
// src/script/index.ts
interface ScriptBuilderOptions {
  topic: Topic;
  angle: Angle;
  hook: Hook;
  format: 'longform' | 'shortform' | 'linkedin';
  duration?: number; // Target duration in seconds (default 60)
}

export function buildScript(options: ScriptBuilderOptions): Script {
  // 1. Create script structure based on format
  // 2. Hook → opening (first 10 seconds)
  // 3. Angle → body content
  // 4. Call-to-action → closing (last 10 seconds)
  // 5. Estimate duration
  // 6. Return complete Script object
}
```

**Script templates:**

_Longform (YouTube, 180-300 words):_
```
[HOOK - 10 sec]
"Most people think [old belief]. But here's what actually works..."

[BODY - main content, 2-4 minutes]
"The reason is simple..."
[2-3 key points, each with proof]

[CTA - 10 sec]
"So here's what you should do..."
```

_Shortform (TikTok, 30-60 words):_
```
[HOOK - 2-3 sec, pattern interrupt]
[RAPID DEMONSTRATION or CLAIM - 3-5 sec]
[TWIST or PAYOFF - 2-3 sec]
[IMPLIED CTA]
```

_LinkedIn (150-200 words):_
```
[HOOK - 1-2 sentences, professional]
"I used to think [old], but [insight]..."

[INSIGHT - 3-4 sentences with proof]
"Here's what changed..."

[ACTION - 1-2 sentences]
"If you're in [role], consider..."
```

**Files:**
- `src/script/templates.ts` — Format templates
- `src/script/builder.ts` — Script assembly logic
- `src/script/index.ts` — Public API
- `tests/script.test.ts` — Full test suite

**Tests:**
- [ ] buildScript() creates valid Script object
- [ ] Script has correct format
- [ ] Script includes hook + angle content
- [ ] Duration estimate is reasonable
- [ ] Longform scripts are ~300 words
- [ ] Shortform scripts are ~60 words
- [ ] LinkedIn scripts are ~200 words

**Phase 1.4 Effort:** ~5 hours

#### P1.5: Analyze Workflow (Performance Tracking) (4 hours)

**Goal:** Ingest video performance metrics and provide analytics

**Implementation:**

```typescript
// src/analyze/index.ts
interface AnalyzeOptions {
  script_id: string;
  metrics: {
    platform: string;
    views: number;
    engagement_rate: number; // 0-1 (decimal)
    click_through_rate?: number;
    conversion_rate?: number;
  };
}

export async function recordPerformance(options: AnalyzeOptions): Promise<PerformanceMetric> {
  // 1. Calculate hook_performance based on initial engagement spike
  // 2. Store metric in agent brain history
  // 3. Return metric object
}

export function analyzePatterns(agentBrain: AgentBrain): {
  best_hook_patterns: string[];
  best_angles: string[];
  best_platforms: string[];
} {
  // 1. Analyze performance_history
  // 2. Identify best-performing hook patterns
  // 3. Identify best-performing angle types
  // 4. Identify best-performing platforms
  // 5. Return insights
}
```

**Files:**
- `src/analyze/index.ts` — Main analytics functions
- `src/analyze/insights.ts` — Pattern analysis
- `tests/analyze.test.ts` — Full test suite

**Tests:**
- [ ] recordPerformance() creates valid PerformanceMetric
- [ ] analyzePatterns() identifies best hook patterns
- [ ] analyzePatterns() identifies best platforms
- [ ] Performance data persists in agent brain
- [ ] Insights improve with more data samples

**Phase 1.5 Effort:** ~4 hours

#### P1.6: CLI Interface (4 hours)

**Goal:** Create user-friendly command-line interface for all workflows

**Commands:**
```bash
viral-flow discover --keywords "AI" --sources youtube,reddit --max 10
viral-flow angle --topic-id "topic-123" --formats longform,shortform
viral-flow hook --topic-id "topic-123" --angle-id "angle-456"
viral-flow script --topic-id "topic-123" --angle-id "angle-456" --hook-id "hook-789"
viral-flow analyze --script-id "script-000" --views 5000 --engagement-rate 0.12
viral-flow brain --action update --performance-data "path/to/data.json"
```

**Files:**
- `src/cli.ts` — Main CLI entry point
- `bin/viral-flow` — Executable wrapper
- Update `package.json` with `bin` field

**Phase 1.6 Effort:** ~4 hours

#### P1.7: Comprehensive API Documentation (3 hours)

**Goal:** Write full API documentation in `docs/API.md`

**Sections:**
- Installation (npm install, CLI setup)
- Quick start (5-minute tutorial)
- Core workflows (discover, angle, hook, script, analyze)
- Data types and interfaces
- Error handling
- Configuration (environment variables, auth keys)
- Plugin architecture (how to add custom sources)
- Examples (real-world usage)

**Phase 1.7 Effort:** ~3 hours

#### P1.8: Test Coverage & Quality (4 hours)

**Goal:** Achieve 80%+ test coverage across all modules

- [ ] Run full test suite
- [ ] Generate coverage report
- [ ] Identify gaps (< 80% coverage)
- [ ] Add missing tests
- [ ] Verify coverage threshold

**Phase 1.8 Effort:** ~4 hours

**Phase 1 Total Effort:** ~40 hours  
**Estimated Completion:** May 27, 2026  
**Deliverable:** v0.1.0 release (GitHub + npm)

---

## Phase 2: Agent Brain (Trainable Model) (Week 4)

### Objectives
1. Implement agent state persistence
2. Build feedback loop from performance data
3. Create learning algorithms (pattern recognition)

### Key Tasks

#### P2.1: Agent Brain State Management (6 hours)
- Persist agent brain to JSON/database
- Load and update agent state
- Track learning history

#### P2.2: Feedback Loop Integration (6 hours)
- Link PerformanceMetric → AgentBrain learning
- Update best_hook_patterns, best_angles, best_platforms
- Recalibrate scoring based on performance

#### P2.3: Learning Algorithms (6 hours)
- Pattern ranking (which hooks/angles perform best for this audience?)
- Audience preference inference
- Platform optimization

**Phase 2 Total Effort:** ~18 hours  
**Estimated Completion:** June 3, 2026  
**Deliverable:** v0.2.0 release

---

## Phase 3: Multi-Account & Platform Routing (Week 5)

### Objectives
1. Support multiple platforms and accounts
2. Platform-specific strategy (format optimization per platform)
3. Account registry and series management

### Key Tasks

#### P3.1: Account Registry (5 hours)
- Store platform accounts (YouTube channel 1, 2, TikTok account A, etc.)
- Credentials management (API keys, OAuth tokens)
- Account metadata (audience demographics, performance baseline)

#### P3.2: Series Management (5 hours)
- Define series (groups of videos with consistent theme/voice)
- Assign accounts to series
- Track series performance

#### P3.3: Platform Adapters (8 hours)
- YouTube adapter (fetch trending, video specs, upload workflow)
- TikTok adapter (fetch trending, video specs, upload workflow)
- Instagram adapter (fetch trending, video specs, upload workflow)
- LinkedIn adapter
- Generic adapter (for future platforms)

**Phase 3 Total Effort:** ~18 hours  
**Estimated Completion:** June 10, 2026  
**Deliverable:** v0.3.0 release

---

## Phase 4: Brain Integration (Week 6)

### Objectives
1. Create `/goviralbro` skill in brain repo
2. Integrate Viral Flow into `/video` orchestrator
3. Add DISCOVER phase to video production pipeline
4. End-to-end testing

### Key Tasks

#### P4.1: Create `/goviralbro` Skill (4 hours)
- Write `brain/ai/skills/custom/goviralbro/SKILL.md`
- Natural language routing for discover, angle, hook, script, analyze
- Integration with brain's skill ecosystem

#### P4.2: Integrate into `/video` (3 hours)
- Add DISCOVER workflow to `/video` orchestrator
- Update `/video` natural language routing table
- Test DISCOVER → WRITE → VOICE → COMPOSE pipeline

#### P4.3: End-to-End Testing (3 hours)
- Create example: topic discovery → angle generation → script → video production
- Test full pipeline with real data
- Document workflow

**Phase 4 Total Effort:** ~10 hours  
**Estimated Completion:** June 17, 2026  
**Deliverable:** Production-ready brain integration

---

## Phase 5: Community & Polish (Week 7-8)

### Objectives
1. Write comprehensive documentation
2. Create example projects
3. Set up contributor onboarding
4. Community feedback incorporation

### Key Tasks

#### P5.1: Documentation (6 hours)
- Write EXAMPLES.md (5-10 real-world scenarios)
- Write CONTRIBUTING.md (how to add new discovery sources, plugins)
- Write ARCHITECTURE.md deep dive
- Add inline code comments
- Create troubleshooting guide

#### P5.2: Example Projects (4 hours)
- Example 1: "YouTube Educational Channel" (discovery + scripts + analytics)
- Example 2: "TikTok Creator" (shortform angles + rapid posting)
- Example 3: "LinkedIn Thought Leader" (professional angles + engagement metrics)

#### P5.3: Release & Promotion (4 hours)
- Write release notes for v0.4.0
- Create GitHub releases with checksums
- Publish to npm with keywords
- Share on product hunt, Twitter, Reddit communities

**Phase 5 Total Effort:** ~14 hours  
**Estimated Completion:** July 1, 2026  
**Deliverable:** v0.4.0 release + community-ready project

---

## Summary: Effort by Phase

| Phase | Name | Duration | Effort | Start | End |
|-------|------|----------|--------|-------|-----|
| **0** | Foundation | 1 week | 11 hrs | May 7 | May 13 |
| **1** | Core Workflows | 2 weeks | 40 hrs | May 14 | May 27 |
| **2** | Agent Brain | 1 week | 18 hrs | May 28 | Jun 3 |
| **3** | Multi-Account | 1 week | 18 hrs | Jun 4 | Jun 10 |
| **4** | Brain Integration | 1 week | 10 hrs | Jun 11 | Jun 17 |
| **5** | Community & Polish | 2 weeks | 14 hrs | Jun 18 | Jul 1 |
| **TOTAL** | **Viral Flow MVP + Integration** | **8 weeks** | **111 hours** | **May 7** | **Jul 1** |

---

## Critical Dependencies & Milestones

### Blockers (None)
- All work is internal; no external dependencies

### High Priority
- Phase 1: Core workflows (gates everything else)
- Phase 2: Agent brain (gates Phase 3)
- Phase 4: Brain integration (gates production use)

### Success Criteria

**Phase 0 (May 13):**
- ✅ Repo has full project structure
- ✅ CI/CD green (tests pass, linting passes)
- ✅ README explains project clearly
- ✅ 0 open GitHub issues

**Phase 1 (May 27):**
- ✅ All 5 workflows implemented
- ✅ 80%+ test coverage
- ✅ v0.1.0 published to npm
- ✅ CLI fully functional
- ✅ API documentation complete

**Phase 2 (Jun 3):**
- ✅ Agent brain persists and learns
- ✅ Feedback loop working (performance → learning → scoring improvement)
- ✅ v0.2.0 published

**Phase 3 (Jun 10):**
- ✅ Multi-account support
- ✅ Platform adapters for 3+ platforms
- ✅ v0.3.0 published

**Phase 4 (Jun 17):**
- ✅ `/goviralbro` skill created in brain
- ✅ DISCOVER phase integrated into `/video`
- ✅ End-to-end pipeline tested with real video
- ✅ Production-ready

**Phase 5 (Jul 1):**
- ✅ Comprehensive documentation
- ✅ v0.4.0 published
- ✅ Community-ready (examples, contributing guide)
- ✅ 50+ stars on GitHub (aspirational)

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-07 | Rebuild (vs. wrap GoViralBro) | Ownership, tech stack alignment, customization |
| 2026-05-07 | Separate repo + brain skill | Portfolio value, community potential, integration |
| 2026-05-07 | Phase 0 before Phase 1 | CI/CD, testing, docs from day one (prevents tech debt) |
| 2026-05-07 | 80%+ test coverage target | Production readiness, confidence in changes |
| 2026-05-07 | TypeScript over JavaScript | Type safety, self-documenting code, easier maintenance |

---

## Next Steps

1. **Approve implementation plan** (this document)
2. **Assign Phase 0 tasks** to specific owners/dates
3. **Schedule weekly syncs** to track progress
4. **Define success metrics** for each phase gate
5. **Execute Phase 0** (May 7-13)

---

**End of Implementation Plan**
