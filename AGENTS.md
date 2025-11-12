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

Suggest actionable solutions – concrete patches, tests, docs.

Respect constraints – embedded in Home Assistant; keep bundle small and browser-safe.

Document your advice – explain reasoning and reference sources.

3. Coding & Architecture Standards

Language: TypeScript (front-end/dashboard card).

Bundler: Rollup with tree-shaking enabled.

Imports: Use default imports for plugins (import terser from '@rollup/plugin-terser').

Constants: Use readonly for immutable arrays.

Typing: No any; type events (MessageEvent<any>).

Docs: Every exported symbol has JSDoc/TS doc-comments.

Tests: Add unit tests for state and voice logic.

Lint/Format: ESLint + Prettier must pass cleanly.

4. Branching / Versioning / Release Policy

main branch = production-ready at all times.

feature/ branches for new features; fix/ for bugs.

Use semantic versioning (major.minor.patch).

Release Workflow

Bump version in package.json.

Update CHANGELOG.md and any user-facing files (README, manifest.json).

Build the bundle:

npm run build


Tag and publish the release on GitHub.

Push tag to main so HACS can detect it.

Release Commands

Dev:

npm run build && npm run release:dev -- 1.0.327-dev.0


Prod:

npm run build && npm run release -- 1.0.327

5. HACS Compliance Requirements

This card must be HACS-compliant so that users can install it directly through Home Assistant Community Store.

Agents must ensure:

The repository includes a hacs.json with valid metadata (name, filename, homeassistant category).

The main distribution file is built to dist/nabu-eyes-dashboard-card.js.

The version tag matches the release version.

Each release on GitHub has an attached compiled artifact and CHANGELOG entry.

The README includes HACS installation instructions and manual URL (/hacsfiles/nabu-eyes-voice-avatar/nabu-eyes-dashboard-card.js).

Manifest fields (version, resources) are kept in sync with tags.

6. Review / Pull Request Checklist

Before merging:

 All new code typed, documented, tested.

 No build errors or warnings.

 Bundle size stable.

 Licenses compatible (MIT preferred).

 CHANGELOG and README updated for user-visible changes.

7. Voice & Interaction Rules

Voice responses concise and contextual.

Avatar animations reflect state transitions.

Handle unknown states gracefully (silent, unavailable).

Use readonly string[] for activeStates.

8. Documentation & User Guide

Keep README.md current with features and install instructions.

Each release must update CHANGELOG.md and publish a GitHub release note.

Add troubleshooting for voice permissions and HA integration.

9. Security & Privacy

Never log private audio data.

Provide opt-in/out for voice logging.

Run npm audit fix regularly.

10. Known Limitations & Roadmap

Current targets: Home Assistant + Awtrix3 / Ulanzi Clock.

Planned: multi-language TTS, offline voice engine, lip-sync, mobile dashboard.

Track via GitHub Projects label roadmap.

11. Agent Escalation Policy

If blocked:

Label issue needs-spec or blocked.

Describe missing information (e.g., API key, design doc).

Tag repo owner for decision.

End of AGENTS.md
Thank you for keeping the project HACS-compliant, maintainable and release-ready.