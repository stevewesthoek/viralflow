# Community & Contributing

Welcome! Viral Flow is a community project. We invite you to:

- ⭐ **Star it** — Signal that you find this valuable
- 🍴 **Fork it** — Customize for your workflow
- 💬 **Discuss it** — Open issues, ask questions, share ideas
- 🐛 **Report bugs** — Help us fix what's broken
- 🔧 **Submit pull requests** — Add features, fix issues, improve docs
- 📢 **Share it** — Tell other creators/teams/agencies about Viral Flow
- 📝 **Comment on code** — Give feedback on design and implementation
- 🎯 **Suggest integrations** — "Could this work with X?" → Probably yes!

---

## Getting Started

### I Want to Use Viral Flow

1. Read [README.md](./README.md)
2. Run the quick start example (copy/paste, 5 minutes)
3. Check [docs/EXAMPLES.md](./docs/EXAMPLES.md) for real workflows
4. Open an issue if something doesn't work

### I Want to Contribute Code

1. **Fork the repo** (top-right button)
2. **Clone your fork:** `git clone https://github.com/YOUR-USERNAME/viralflow.git`
3. **Read [CONTRIBUTING.md](./docs/CONTRIBUTING.md)** for guidelines
4. **Pick an issue** — Look for `good-first-issue` or `help-wanted` labels
5. **Ask before you code** — Comment on the issue, confirm it's the right approach
6. **Code + test** — See "Development Setup" below
7. **Submit a PR** — Include tests + documentation

### I Want to Report a Bug

1. **Check existing issues** — Your bug might already be known
2. **Create a new issue** with:
   - What you tried
   - What you expected
   - What actually happened
   - Steps to reproduce (code example is 🔥)
   - Your environment (Node version, OS, etc.)

### I Want to Suggest a Feature

1. **Open a GitHub Discussion** (not an issue)
2. **Describe the feature:**
   - What problem does it solve?
   - How would you use it?
   - Why is it valuable?
3. **We'll discuss** — Sometimes features belong in user code, not the core
4. **If approved** → Turns into an issue → Becomes a PR

---

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/viralflow.git
cd viralflow

# Install dependencies
npm install

# Run tests (make sure they pass before coding)
npm test

# Watch mode (auto-rerun tests as you edit)
npm run test:watch

# Lint check
npm run lint

# Build TypeScript
npm run build
```

### Before You Submit a PR

```bash
# Make sure tests pass
npm test

# Make sure lint passes
npm run lint

# Check coverage (aim for 80%+)
npm run test:coverage
```

If any of these fail, your PR won't be merged. Let's keep the codebase clean.

---

## Code Standards

### TypeScript
- **Strict mode required** — No `any` types without good reason
- **Well-typed functions** — Parameters and return types explicit
- **Comments for complex logic** — See [src/hook/scoring.ts](./src/hook/scoring.ts) for examples

### Testing
- **Every feature gets tests** — Jest, 100% for new code
- **Integration tests** — Ensure full workflows work
- **Happy path + edge cases** — Test normal use and error conditions

### Documentation
- **Functions have JSDoc comments** — What it does, why, example usage
- **Complex logic has inline comments** — Why this approach? What was the tradeoff?
- **README updated** — If adding new feature, update README + docs/API.md

### Style
- **Readable over clever** — Clear variable names > clever one-liners
- **Consistent** — Follow existing patterns in the codebase
- **Commented for maintainers** — Future you (or someone else) should understand why

---

## What We're Looking For

### Good First Issues
- Documentation fixes (typos, clarity)
- Test improvements
- Small utility functions
- Bug fixes in isolated modules

### Medium Issues
- New discovery sources
- Additional hook patterns
- Performance improvements
- CI/CD enhancements

### Big Features (Discuss First!)
- New core workflows
- Major architecture changes
- Large refactors

**Rule:** If you're unsure, ask first. Comment on an issue or open a discussion.

---

## PR Review Process

1. **You submit PR** → Includes tests, docs, explanation
2. **We review** → Typically within a week
3. **Feedback given** → Usually minor comments or requests for tests
4. **You iterate** → Make changes, push updates (no need to close/reopen)
5. **Approved + merged** → Your code is now part of Viral Flow!
6. **Celebrate** 🎉 — You're officially a contributor!

---

## Real-World Usage

### Using Viral Flow in Production?

Tell us! We'd love to:
- Feature your workflow in [docs/EXAMPLES.md](./docs/EXAMPLES.md)
- Learn what works / what needs improvement
- Understand how you integrated it with other tools
- Showcase your use case (with permission)

**How to share:**
- Open a GitHub Discussion
- Include: what you built, how you use Viral Flow, results (optional)
- We might reach out with interview questions (optional)

---

## Communication Channels

| Channel | Use For |
|---------|---------|
| **GitHub Issues** | Bug reports, feature requests, technical discussions |
| **GitHub Discussions** | Ideas, use cases, questions, community feedback |
| **GitHub PRs** | Code changes, documentation, fixes |
| **Twitter** | Announcements, celebrations, community shout-outs |

---

## Community Standards

We're committed to a welcoming, inclusive community. Expect:

- ✅ Respectful, constructive feedback
- ✅ Appreciation for all contribution levels
- ✅ Prompt responses (typically within 48 hours)
- ✅ Honest conversations about tradeoffs
- ✅ Celebration of wins, big and small

We have zero tolerance for:
- ❌ Disrespect or harassment
- ❌ Spam or self-promotion
- ❌ Bad-faith arguments

If you see behavior that doesn't fit our values, report it to Steve (contact via GitHub profile).

---

## Roadmap & Where You Can Help

### v0.3.0 (Current)
- ✅ Multi-account platform routing
- 🎯 **Help wanted:** Real-world testing, bug reports, documentation feedback

### v0.4.0 (Next)
- 🚀 Community release, npm publication, contributor onboarding
- 🎯 **Help wanted:** Browser UI mockups, integration examples, beginner guides

### v1.0 (Future)
- 📍 Stable API, enterprise support
- 🎯 **Help wanted:** Enterprise features, scaling patterns, advanced integrations

### Areas Where Contributions Are Especially Valuable

1. **New Discovery Sources**
   - Twitter/X trending topics
   - Pinterest trends
   - Hacker News hot posts
   - Your favorite platform!

2. **Additional Hook Patterns**
   - New copywriting patterns based on research
   - Platform-specific patterns (TikTok vs YouTube hooks differ)
   - Emotional patterns we're missing

3. **Platform Integration Examples**
   - "How to use with n8n"
   - "Integrate with YouTube API directly"
   - "Post to Instagram/TikTok via API"

4. **Documentation**
   - Getting started guides for different user types
   - Integration tutorials
   - Performance tuning guide
   - API cookbook

5. **Testing & Quality**
   - Find edge cases and report them
   - Improve test coverage
   - Performance benchmarks
   - Security reviews

---

## Recognition

All contributors are:
1. Added to [CONTRIBUTORS.md](./CONTRIBUTORS.md) (honor roll)
2. Credited in release notes
3. Celebrated in our community channels
4. Invited to community calls (if interested)

Your work matters. We recognize it publicly.

---

## Questions?

- 📖 **How do I...?** → Check [README.md](./README.md) and [docs/](./docs/)
- 🐛 **Found a bug** → Open a GitHub issue with reproduction steps
- 💡 **Have an idea** → Open a GitHub Discussion
- 🤝 **Want to collaborate** → Comment on an open issue or DM on GitHub
- 📢 **Using Viral Flow?** → Share your story in Discussions!

---

## Thank You

Thank you for being here. Whether you're using Viral Flow, reporting bugs, suggesting features, or submitting code—**you're helping build better content systems.**

Let's do this together.

**Steve Westhoek & the Viral Flow Community**

---

**Ready to get started?**
- [Fork the repo](https://github.com/stevewesthoek/viralflow/fork)
- [Read CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- [Pick an issue](https://github.com/stevewesthoek/viralflow/issues?q=is:issue+is:open+label:"good-first-issue")
- [Open a Discussion](https://github.com/stevewesthoek/viralflow/discussions)

We can't wait to see what you build! 🚀
