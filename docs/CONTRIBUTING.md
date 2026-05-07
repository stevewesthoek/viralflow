# Contributing to Viral Flow

Thank you for wanting to contribute! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and professional. We're building this together.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 8+
- Git

### Development Setup

```bash
# Clone the repo
git clone https://github.com/stevewesthoek/viralflow.git
cd viralflow

# Install dependencies
npm install

# Verify everything works
npm test
npm run lint
npm run build
```

### Making Changes

1. **Create a branch** for your work
   ```bash
   git checkout -b feature/my-feature
   # or: git checkout -b fix/my-bugfix
   ```

2. **Make your changes** following coding standards (see below)

3. **Run tests and lint**
   ```bash
   npm test          # Run tests
   npm run lint      # Check code quality
   npm run format    # Auto-format code
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "Add feature X to discovery"
   # Good: "Fix YouTube API rate limit handling"
   # Good: "Add Reddit discovery source"
   # Bad: "stuff", "WIP", "fix"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/my-feature
   # Then open PR on GitHub
   ```

## Coding Standards

### TypeScript
- Use strict TypeScript (`strict: true` in tsconfig.json)
- Export types from `src/types.ts`
- Use interfaces for data models
- Add JSDoc comments to public functions

### Naming
- Functions: camelCase (`generateAngles`, `scoreHook`)
- Classes: PascalCase (`YouTubeSource`, `Analyzer`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- Private members: `_privateMethod`, `_privateVar`

### Formatting
- 2-space indentation
- Max line length: 100 characters
- Single quotes for strings
- Trailing commas in multi-line structures

(Auto-enforced by Prettier + ESLint. Run `npm run format` before committing.)

### Testing
- All new code must have tests
- Target: 80%+ coverage
- Use Jest for unit tests
- Mock external APIs (YouTube, Reddit)

**Example test:**
```typescript
describe('generateAngles', () => {
  test('creates 15 angles (5 per format)', () => {
    const topic = { /* ... */ };
    const angles = generateAngles(topic, ['longform', 'shortform']);
    expect(angles).toHaveLength(10); // 5 + 5
    expect(angles.map(a => a.format)).toContain('longform');
  });
});
```

### Error Handling
- Throw descriptive errors with context
- Use custom error classes for domain errors
- Never silently fail

```typescript
// Good
if (!topic) {
  throw new Error(`Topic not found: ${topicId}`);
}

// Bad
if (!topic) return;
```

### Comments
- Write code that's self-explanatory
- Add comments for WHY, not WHAT
- Document edge cases and gotchas

```typescript
// Good: Explains why
// YouTube API rate limits to 10k quota units/day. We cache results
// to avoid burning quota during development.

// Bad: Restates code
// Check if topic exists
if (!topic) { ... }
```

## Adding a Discovery Source

See [ARCHITECTURE.md](../ARCHITECTURE.md#plugin-architecture) for the full pattern.

**Steps:**

1. Create `src/discover/my-source.ts`
   ```typescript
   import { Topic } from '../types';
   
   export class MySource {
     async discover(keywords: string[]): Promise<Topic[]> {
       // Fetch from your API
       // Score each result
       // Return Topic[]
     }
   }
   ```

2. Write tests in `tests/discover.test.ts`

3. Register in `src/discover/index.ts`

4. Update README with instructions

5. Submit PR with link to source documentation

## Adding a Hook Pattern

Hook patterns are data-driven. To add a new pattern:

1. Edit `src/hook/patterns.ts` — add your pattern to the 6-element list
2. Document the pattern's effectiveness (when does it work best?)
3. Update tests to cover your pattern
4. Submit PR with research/rationale

## Fixing Bugs

1. Create a test that reproduces the bug (should fail)
2. Fix the code (make the test pass)
3. Verify all other tests still pass
4. Commit with clear message: "Fix: [describe bug]"

## Improving Performance

Before optimizing:
1. Benchmark the current behavior (`npm run benchmark`)
2. Identify the bottleneck
3. Implement improvement
4. Verify it's actually faster
5. Verify it's not less correct

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for design changes
- Add/update JSDoc comments for API changes
- Add examples in `docs/EXAMPLES.md`

## PR Review Checklist

Before submitting, ensure:
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Coverage is 80%+ for new code
- [ ] Tests cover happy path and error cases
- [ ] Commit messages are clear
- [ ] README or docs are updated (if applicable)
- [ ] No breaking changes (or clearly documented if intentional)

## Questions?

- Open an issue on GitHub
- Check existing issues for similar questions
- Ask on Twitter: [@stevewesthoek](https://twitter.com/stevewesthoek)

---

Thank you for contributing to Viral Flow! 🚀
