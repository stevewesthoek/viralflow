# Phase 0: Foundation — Task Breakdown

**Phase Duration:** May 7-13, 2026 (1 week)  
**Total Effort:** 11 hours  
**Goal:** Project skeleton, CI/CD, and architectural foundation

---

## Task List (Executable Format)

### [ ] P0.1: Project Structure & Package Setup
**Effort:** 2 hours  
**Owner:** Implementation  
**Status:** Not started

**Subtasks:**
- [ ] Initialize git repo (already cloned)
- [ ] Create `package.json` with metadata
  - name: "viralflow"
  - version: "0.1.0"
  - description: "Platform-agnostic content discovery and strategy system"
  - author: "Steve Westhoek"
  - license: "MIT"
  - main: "dist/index.js"
  - types: "dist/index.d.ts"
  - scripts: test, lint, build, prepare, release
- [ ] Create `tsconfig.json` (strict mode)
- [ ] Create `.gitignore` (node_modules, dist, coverage, .env, .DS_Store)
- [ ] Create `.editorconfig` (indent_style, indent_size, end_of_line, charset, trim_trailing_whitespace)
- [ ] Create directory structure:
  ```
  src/
  tests/
  docs/
  examples/
  .github/workflows/
  ```
- [ ] Create stub files:
  - `src/index.ts` (main export)
  - `src/types.ts` (TS interfaces)
  - `src/utils.ts` (helpers)
  - `tests/setup.ts` (test configuration)
  - `LICENSE` (MIT text)

**Success Criteria:**
- [ ] `package.json` has all required fields
- [ ] Folder structure matches plan
- [ ] `npm install` succeeds
- [ ] TypeScript compilation succeeds

---

### [ ] P0.2: CI/CD Pipeline (GitHub Actions)
**Effort:** 2 hours  
**Owner:** Implementation  
**Status:** Not started

**Subtasks:**
- [ ] Create `.github/workflows/ci.yml`
  - Trigger: on push, pull_request to main
  - Steps:
    1. Checkout code
    2. Setup Node.js (v24)
    3. Install dependencies
    4. Lint (ESLint)
    5. Run tests (Jest)
    6. Upload coverage to Codecov
    7. Fail if coverage < 80%
- [ ] Create `.github/workflows/release.yml`
  - Trigger: on git tag (v0.*)
  - Steps:
    1. Checkout code
    2. Setup Node.js
    3. Install dependencies
    4. Build
    5. Publish to npm (requires NPM_TOKEN secret)
    6. Create GitHub Release
- [ ] Set up GitHub branch protection:
  - Require passing tests
  - Require code review
  - Require up-to-date before merge
- [ ] Add secrets to GitHub repo:
  - NPM_TOKEN
  - CODECOV_TOKEN

**Success Criteria:**
- [ ] CI workflow runs on PR and passes
- [ ] Release workflow ready (manual trigger for now)
- [ ] Branch protection enforced

---

### [ ] P0.3: Testing Infrastructure
**Effort:** 1.5 hours  
**Owner:** Implementation  
**Status:** Not started

**Subtasks:**
- [ ] Create `jest.config.js`
  - preset: "ts-jest"
  - testEnvironment: "node"
  - coverageThreshold: 80%
  - testMatch: "tests/**/*.test.ts"
- [ ] Create `tests/setup.ts`
  - Global test configuration
  - Common imports/mocks
- [ ] Create `tests/sanity.test.ts`
  - Test: "package loads successfully"
  - Test: "main export is defined"
  - Test: "types are exported"

**Success Criteria:**
- [ ] `npm test` runs and passes
- [ ] Coverage report generated
- [ ] Tests are isolated (no global state)

---

### [ ] P0.4: Architecture & Design Docs
**Effort:** 2 hours  
**Owner:** Implementation  
**Status:** Not started

**Subtasks:**
- [ ] Create `ARCHITECTURE.md`
  - System overview (diagram in ASCII)
  - Data flow (input → discovery → angles → hooks → scripts → analyze)
  - Plugin architecture (how to add discovery sources)
  - Extensibility roadmap
  - Design principles (platform agnosticity, environment agnosticity)
- [ ] Create `docs/API.md` (skeleton)
  - Placeholder for Phase 1
- [ ] Create `docs/EXAMPLES.md` (skeleton)
  - Placeholder for Phase 1
- [ ] Create `docs/CONTRIBUTING.md`
  - How to set up dev environment
  - Coding standards (ESLint, Prettier, TypeScript)
  - PR process
  - Testing requirements
  - How to add plugins

**Success Criteria:**
- [ ] ARCHITECTURE.md is clear and complete
- [ ] CONTRIBUTING.md is actionable for new developers

---

### [ ] P0.5: Linting & Code Quality Setup
**Effort:** 1 hour  
**Owner:** Implementation  
**Status:** Not started

**Subtasks:**
- [ ] Create `.eslintrc.js`
  - extends: "airbnb-typescript"
  - parser: "@typescript-eslint/parser"
  - parserOptions: includes tsconfig.json path
  - rules: (standard + some relaxations for readability)
- [ ] Create `.prettierrc`
  - singleQuote: true
  - trailingComma: "es5"
  - printWidth: 100
  - tabWidth: 2
- [ ] Set up husky (pre-commit hooks)
  - `npx husky install`
  - Create `.husky/pre-commit` (run lint-staged)
- [ ] Set up lint-staged
  - Create `lint-staged.config.js`
  - Run eslint on .ts files
  - Run prettier on all files
- [ ] Update `package.json` scripts:
  - `"lint": "eslint src tests --ext .ts"`
  - `"format": "prettier --write 'src/**/*.ts' 'tests/**/*.ts'"`

**Success Criteria:**
- [ ] `npm run lint` succeeds
- [ ] `npm run format` succeeds
- [ ] Pre-commit hooks block commits with lint errors

---

### [ ] P0.6: Dependencies & Tooling
**Effort:** 1 hour  
**Owner:** Implementation  
**Status:** Not started

**Subtasks:**
- [ ] Create `package.json` with dependencies:
  - Core: typescript, axios, joi, dotenv, winston
  - Dev: jest, ts-jest, @types/jest, eslint, prettier, husky, lint-staged, @typescript-eslint/*, ts-node
- [ ] Run `npm install`
- [ ] Run `npm ci` to verify lock file
- [ ] Verify no security vulnerabilities (`npm audit`)

**Success Criteria:**
- [ ] All dependencies installed
- [ ] `npm audit` passes
- [ ] `npm run lint` and `npm test` both work

---

### [ ] P0.7: Initial README & Quick Start
**Effort:** 1 hour  
**Owner:** Implementation  
**Status:** Not started

**Subtasks:**
- [ ] Write comprehensive `README.md`:
  - **What is Viral Flow?** (one sentence)
  - **What does it do?** (features, workflows)
  - **What is it NOT?** (not a video production tool, not a hosting platform)
  - **Why Viral Flow?** (vs. GoViralBro, vs. manual content planning)
  - **Quick Start** (installation, first 5-minute example)
  - **Core Workflows** (discover, angle, hook, script, analyze)
  - **Architecture** (ASCII diagram)
  - **Installation** (npm install, CLI setup)
  - **Usage** (CLI commands, programmatic API)
  - **Contributing** (link to CONTRIBUTING.md)
  - **License** (MIT)
- [ ] Ensure README is clear for newcomers

**Success Criteria:**
- [ ] README is clear and complete
- [ ] Quick start is 5 minutes max to first result
- [ ] Contributing guidelines are actionable

---

## Execution Checklist

**Day 1 (May 7):**
- [ ] P0.1: Project Structure (2 hrs)
- [ ] P0.6: Dependencies (1 hr)
- [ ] Verify: `npm install`, `npm test`, `npm run lint` all pass

**Day 2 (May 8):**
- [ ] P0.5: Linting & Code Quality (1 hr)
- [ ] P0.3: Testing Infrastructure (1.5 hrs)
- [ ] Verify: Pre-commit hooks block commits with lint errors

**Day 3 (May 9):**
- [ ] P0.2: CI/CD Pipeline (2 hrs)
- [ ] P0.4: Architecture & Design Docs (2 hrs)
- [ ] P0.7: README & Quick Start (1 hr)

**Day 4 (May 10):**
- [ ] Review all Phase 0 work
- [ ] Verify all success criteria met
- [ ] Commit and push to GitHub

**Days 5-7 (May 11-13):**
- [ ] Buffer for any issues
- [ ] Final documentation review
- [ ] Prepare Phase 1 tasks

---

## Definition of Done (Phase 0)

- [ ] All 7 P0.* tasks completed
- [ ] CI/CD green (GitHub Actions passing)
- [ ] 0 ESLint errors or warnings
- [ ] All tests pass with 80%+ coverage
- [ ] README is complete and clear
- [ ] All team members can clone and run `npm test` successfully
- [ ] GitHub repo is ready for public visibility

---

**Estimated Total Duration:** 11 hours  
**Target Completion:** May 13, 2026  
**Next Phase:** Phase 1 (Core Workflows) starts May 14
