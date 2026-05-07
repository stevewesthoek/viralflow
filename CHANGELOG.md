# Changelog

All notable changes to Viral Flow are documented in this file.

## [0.4.0] — 2026-05-07

**Community Release: CLI, Multi-Platform Adapters, Advanced Discovery**

### New Features

#### CLI Interface
- Complete production CLI with 8 commands: `discover`, `angles`, `hooks`, `script`, `analyze`, `post`, `accounts list`, `accounts add`
- All commands support `--json` flag for machine-readable output (n8n compatible)
- Built-in help system and error handling

#### Platform Adapters
- **YouTube Adapter**: OAuth2 flow, upload via Data API v3 (resumable), scheduling, status polling, token refresh
- **TikTok Adapter**: OAuth2 flow, upload via Content Posting API v2, scheduling, privacy level mapping, status tracking
- Auto-registration when environment variables are present
- Extensible adapter pattern for adding new platforms

#### Discovery Sources
- **Twitter Source**: Twitter API v2 integration for trending discussions and viral content discovery
- **TikTok Trends Source**: TikTok Research API integration for hashtag trending and growth analysis
- All sources fall back to mock data when credentials are unavailable

#### Performance Optimization
- **Discovery Caching**: SHA256-based cache keys, TTL expiration (configurable via `VIRAL_FLOW_CACHE_TTL_MINUTES`, default 60 minutes)
- **Batch Script Generation**: `buildScripts()` for parallel processing of multiple topics (chunk size 3)
- **Brain Write Buffering**: Dirty-flag pattern reduces I/O by buffering writes and flushing every 30 seconds

### Bug Fixes

#### Code Quality
- Fixed non-deterministic Math.random() placeholders in brain learning with real performance-based inference
- Replaced hardcoded heuristics (e.g., "best_engagement_time: 'evening'") with computed values from actual data
- Added view_duration tracking to PerformanceMetric for format preference analysis
- Format preference now returns `boolean | null` instead of random guesses

### Documentation

- Added `.env.example` with all required environment variables for all discovery sources and posting adapters
- Updated ABOUT.md: "Minimal dependencies" instead of misleading "Zero dependencies" claim
- Added `docs/API.md` with complete public API reference
- Added `docs/EXAMPLES.md` with 5 real-world scenarios and code examples
- Added `docs/CONTRIBUTING.md` with guidelines for adding discovery sources and platform adapters

### Package Publishing

- `package.json`: Version bumped to 0.4.0, added `files` field, added `exports` map for ESM/CJS/types
- Created `.npmignore` to exclude src/, tests/, coverage/ from npm tarball
- Configured ~/.config/viralflow/.env for credential storage (mode 600, gitignored)
- Brain credentials index added for centralized credential tracking

### Internal Changes

- Updated PostingOrchestrator to auto-register adapters on initialization
- Discover index now exports TwitterSource and TikTokTrendsSource
- All 158 tests passing (CLI, adapters, discovery, posting, integration, sanity)

### Dependencies

- axios: HTTP requests
- dotenv: Environment configuration
- joi: Input validation
- winston: Logging
- **Zero external cloud dependencies** — all APIs use self-hosted integrations or mock fallbacks

### Environment Variables

**Discovery:**
- `YOUTUBE_API_KEY` — YouTube discovery (optional, falls back to mock)
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` — Reddit discovery (optional, falls back to mock)
- `TWITTER_BEARER_TOKEN` — Twitter discovery (optional, falls back to mock)
- `TIKTOK_RESEARCH_CLIENT_KEY` — TikTok trends discovery (optional, falls back to mock)

**Posting:**
- `YOUTUBE_OAUTH_CLIENT_ID`, `YOUTUBE_OAUTH_CLIENT_SECRET`, `YOUTUBE_OAUTH_REDIRECT_URI` — YouTube posting
- `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` — TikTok posting

**Performance:**
- `VIRAL_FLOW_CACHE_TTL_MINUTES` — Discovery cache TTL (default 60 minutes)

### Migration Notes

If upgrading from v0.1.0:
- CLI commands have changed; use `viral-flow --help` to see new interface
- Platform adapters are now auto-registered; provide env vars if you want to use them
- No breaking changes to core discovery/angle/hook/script/analyze functions

### Phase 6 Roadmap (Deferred)

Browser UI integration will happen in Phase 6 as a tab in the ProBot dashboard (not a standalone app). Phase 5 focuses on making the npm package production-ready.

---

## [0.1.0] — 2026-01-XX

Initial release with core discovery, angle generation, hook scoring, and script building.
