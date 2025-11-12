Repository: nabu-eyes-voice-avatar

Voice Avatar for Home Assistant and Awtrix3 (Ulanzi Clock)

1. Purpose & Scope

This repository builds a voice-avatar integration for Home Assistant, providing voice-feedback, avatar visualisation, and event-driven interactions.

As an agent working on this repo you will:

Follow the architecture and coding conventions defined here.

Prioritise maintainability, accessibility and performance in voice/UX pipelines.

Assume the user base includes smart-home enthusiasts with technical ability.

2. Agent Role & Behaviour

When assisting with issues, features or code changes you must:

Understand context – review issue, PR, and code.

Suggest actionable solutions – provide concrete patches, tests, and documentation updates.

Respect constraints – embedded in Home Assistant; bundle size and browser compatibility are critical.

Document your advice – include reasoning and references.

3. Coding & Architecture Standards

Language: TypeScript (front-end/dashboard card).

Source Directory: All source files must reside under /src.

Example: /src/nabu-eyes-dashboard-card.ts

Output Directory: All compiled and bundled artifacts must output to /dist.

The /dist folder should not exist or contain stale files before a build.

It must be generated only via build or release commands.

Required Build Outputs:

dist/nabu-eyes-dashboard-card.js

dist/nabu-eyes-dashboard-card.js.gz (gzip-compressed version)

Bundler: Rollup with tree-shaking enabled.

Imports: Use default imports for plugins (import terser from '@rollup/plugin-terser').

Constants: Use readonly for immutable arrays.

Typing: No any; type events as MessageEvent<any>.

Docs: Every exported function/class must include JSDoc or TS doc-comments.

Tests: Add unit tests for critical state-handling and voice logic.

Linting & Formatting: Must pass ESLint and Prettier without warnings.

4. Branching / Versioning / Release Policy

main branch = production-ready at all times.

feature/ branches = new features.

fix/ branches = bug fixes.

Versioning: Semantic Versioning (major.minor.patch).

Release Workflow

Bump version in package.json.

Update CHANGELOG.md and user-facing docs (README.md, hacs.json, manifest.json).

Run the build:

npm run build


This must:

Compile the TypeScript source (/src) to /dist

Generate both .js and .js.gz bundles

Never leave stale files in /dist

Tag and publish the release on GitHub.

Push tag to main for HACS to detect.

- On release, the agent must run `node ./tools/update-changelog.js --version <x.y.z> --write` to promote "Unreleased" to the tagged version and re-seed the Unreleased section.
- PR builds must not write the changelog; they only prove the build outputs exist, then delete `dist/` before committing.

Release Commands

Development release:

npm run build && npm run release:dev -- 1.0.327-dev.0


Production release:

npm run build && npm run release -- 1.0.327

5. HACS Compliance Requirements

This card must remain fully HACS-compliant for Home Assistant Community Store distribution.

Agents must ensure:

Repository includes a valid hacs.json with metadata (name, filename, homeassistant, category).

The main build output is dist/nabu-eyes-dashboard-card.js.

Each release must include both .js and .js.gz in the GitHub release assets.

The GitHub release version tag matches the version in package.json and hacs.json.

The README.md includes HACS installation instructions and manual resource path:

/hacsfiles/nabu-eyes-voice-avatar/nabu-eyes-dashboard-card.js


Manifest and version fields are in sync with release tags.

6. Review / Pull Request Checklist

Before merging any PR:

 Code is typed, documented, tested.

 Build completes with both .js and .gz outputs.

 No build warnings or linting errors.

 Bundle size stable or reduced.

 Licenses are compatible (MIT preferred).

 CHANGELOG.md and README.md updated if user-visible changes occur.

7. Voice & Interaction Rules

Voice responses concise, contextual, and event-linked.

Avatar animation must mirror system or sensor states.

Unknown states handled gracefully (silent, unavailable).

Use readonly string[] for activeStates.

8. Documentation & User Guide

Keep README.md aligned with features, setup steps, and HACS instructions.

Each release must update CHANGELOG.md and publish a GitHub release note.

Include troubleshooting for voice engine, microphone, or Home Assistant issues.

9. Security & Privacy

Never log private audio data.

Offer opt-in/out settings for voice logging.

Run npm audit fix periodically.

10. Known Limitations & Roadmap

Supported: Home Assistant + Awtrix3 / Ulanzi Clock.

Planned: Multi-language TTS, offline voice engine, lip-sync animation, and mobile interface.

Use GitHub Projects label roadmap to track upcoming work.

11. Agent Escalation Policy

If an agent is blocked:

Tag with needs-spec or blocked.

Specify missing info (API key, asset, dependency).

Tag the repo owner for direction.

End of AGENTS.md
Thank you for keeping the project HACS-compliant, cleanly built, and release-ready with proper /src → /dist pipelines.