Repository: nabu-eyes-voice-avatar

Voice Avatar for Home Assistant and Awtrix3 (Ulanzi Clock)

1. Purpose & Scope

This repository builds a voice-avatar integration for Home Assistant, providing voice-feedback, avatar visualisation, and event-driven interactions.
As an agent working on this repo you will:

Follow the architecture and coding conventions defined here.

Prioritise maintainability, accessibility and performance in voice/UX pipelines.

Assume the user base includes smart-home enthusiasts with some technical ability.

2. Agent Role & Behaviour

When assisting with issues, features or code changes you must:

Understand context – examine issue page, PR description, existing code base.

Suggest actionable solutions – propose direct code changes, tests, documentation updates.

Respect constraints – this module is embedded in Home Assistant, so bundle size, runtime dependencies and browser compatibility matter.

Document your advice – always include reasoning, code snippets, and links to documentation when applicable.

3. Coding & Architecture Standards

Language: TypeScript (for front-end/dashboard card) and possibly Python or JS backend for voice logic.

Bundling: Using Rollup; keep bundle minimal, tree-shaking enabled.

Default exports: Use default imports for plugins (e.g., import terser from '@rollup/plugin-terser';).

Immutable defaults: Use readonly for constant arrays, avoid mutating defaults.

Typing: No any where you can define types. Handle unknown event payloads with proper typings.

Documentation: Every exported function/class has JSDoc or TS doc-comments explaining purpose, parameters, return.

Tests: Add unit tests for key logic (state-handling, voice event processing).

Linting/Formatting: Follow existing configurations (ESLint + Prettier). Fix warnings before merge.

4. Branching / Versioning Policy

main branch = production-ready at all times.

feature/ branches for new features or large refactors.

fix/ branches for bug-fixes only.

When merging, bump version in package.json according to semantic versioning (major.minor.patch).

Dev releases (internal/testing) versus public releases must follow your release commands:

Dev: npm run build && npm run release:dev -- 1.0.327-dev.0

Prod: npm run build && npm run release -- 1.0.327

5. Review / Pull Request Checklist

Before a PR is ready to merge, ensure:

 All new code is typed, documented, and tested.

 Bundle size did not grow dramatically (run rollup --stats or similar).

 No new warnings or errors in build logs.

 Dependencies added only if strictly necessary, and their licenses are compatible (MIT preferred).

 Changes described clearly in PR title/description and linked to issue if relevant.

 If user-facing changes: update README or CHANGELOG accordingly.

6. Voice & Interaction Rules

Voice responses should be clear, concise, and context-relevant. Avoid filler words (“um”, “like”).

Avatar feedback should account for state transitions (e.g., “Alarm triggered”, “All clear”, “System unavailable”).

Keep event handling robust: treat unknown states gracefully. Use defaults such as silent, unavailable.

Any “activeStates” lists should use readonly string[] or proper union types, not mutable string[].

7. Documentation & User-Guide

README.md should reflect latest features and installation steps.

When you ship a release, update a CHANGELOG.md (if present) or add a release note.

Include a “Troubleshooting” section covering voice engine issues, micro-phone permissions, Home Assistant integration quirks.

8. Security & Privacy Considerations

Voice input/output may involve user data. Never log sensitive data to public logs.

Introduce default opt-in/opt-out settings for voice logging or analytics.

Ensure dependencies are up-to-date; run npm audit periodically and fix vulnerabilities.

9. Known Limitations & Roadmap

Current support: Home Assistant + Awtrix3 / Ulanzi Clock only (others may require adaptation).

Future: Add multi-language TTS/voice support; offline voice engine; improved avatar lip-sync; mobile companion interface.

Document issues and roadmap items in GitHub Projects/Issues board with “roadmap” label.

10. Agent Escalation Policy

If you (as the agent) cannot resolve an issue due to missing specs, unclear requirements, or external dependency constraints:

Flag the issue with label needs-spec or blocked.

Clearly indicate what is needed (design doc, API key, voice asset, etc.).

If security/permission risk: mark security and tag repo owner.

End of AGENTS.md
Thank you for keeping the project robust, maintainable and aligned with its mission.
