nabu-eyes-voice-avatar

All notable changes to this project are documented here.
This project follows Semantic Versioning: MAJOR.MINOR.PATCH.

[Unreleased]

Added

- Added a distribution verification script that ensures the compiled bundle
  lives under `dist/` and is present before packaging releases.

Changed

- Updated the CI and release workflows to run the distribution verification so
  TypeScript sources never leak outside of `src/` during automation.

Fixed

- Restored ESLint compatibility by routing the configuration through the ESM
  parser shim so `npm run lint` works under Node.js 24.

- Converted the release helper to a native ES module so `npm run release` works in environments that enforce the
  repository's ESM module mode.

[0.0.2] – 2025-11-13
Added

- Enforced semantic-version monotonicity in the release helper and clarified prerelease handling so `npm run release` fails fast when a version is missing from the changelog or regresses the package version.
- Converted project tooling to explicit CommonJS modules and marked the package as ESM to satisfy HACS repository structure validation and eliminate Rollup build warnings.

Changed

- Normalised project metadata so the published package version matches the initial release baseline.

[0.0.1] – 2025-11-12
Added

Initial project setup and repository scaffolding.

rollup.config.js with ES-module build and TypeScript bundling via rollup-plugin-typescript2.

Base src/nabu-eyes-dashboard-card.ts source for the Nabu Eyes dashboard card.

Default voice-avatar configuration and event listener framework.

Type definitions for Home Assistant card config and state handling.

Dev and production release scripts:

Dev: npm run build && npm run release:dev -- 1.0.327-dev.0

Prod: npm run build && npm run release -- 1.0.327

Added root AGENTS.md for agent guidelines and contribution standards.

Fixed

Corrected Rollup config to use import terser from '@rollup/plugin-terser'.

Cleaned TypeScript type errors:

readonly constants (alarm_active_states)

MessageEvent typing for event listener

widened includes() parameter type for strict mode compatibility.

Changed

Updated npm dependencies to latest working versions (eslint-plugin-lit@^2.1.1, smob, etc.).

Removed stale package-lock.json and regenerated fresh dependency tree.

Added "type": "module" to package.json to remove ES-module warning.

Upcoming

Home Assistant card preview for live voice-avatar feedback.

AWTRIX3 LED animation hooks for active voice states.

Optional multi-voice pipeline (BoM AT, Wind Chill, Heat Index, Humidex).

Dashboard configuration UI for comfort-band customization.
