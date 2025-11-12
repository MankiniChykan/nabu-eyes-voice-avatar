Repository: MankiniChykan/nabu-eyes-voice-avatar
Targets: Home Assistant + AWTRIX3 (Ulanzi Clock)
Mission: Voice-feedback + avatar visualization with event-driven behavior, shipped via HACS.

1) Scope & Principles


Ship a reliable, lean Home Assistant dashboard card and assets.


Priority: correctness → performance → maintainability → accessibility.


Assume users are smart-home enthusiasts with moderate technical skills.



2) Repository Layout (mandatory)


Sources: ./src/** only (no code outside src/).


Example: src/nabu-eyes-dashboard-card.ts




Build outputs: ./dist/** (generated only).


Required after a successful build:


dist/nabu-eyes-dashboard-card.js


dist/nabu-eyes-dashboard-card.js.gz






PRs must not commit dist/: ensure .gitignore contains dist/.



3) Tooling & Coding Standards


Language: TypeScript (strict). Avoid any; use unions/generics.


Bundler: Rollup with tree-shaking. Use default terser import:
import terser from '@rollup/plugin-terser';



Types & immutability: Prefer literal unions or readonly arrays; don’t assign a readonly constant to a mutable string[].


Docs: JSDoc/TS docstrings for all exported APIs.


Style: Prettier + ESLint must pass with zero warnings.


Tests: Unit tests for state handling, event routing, and critical transforms.



4) HACS Compliance (non-negotiable)


Root hacs.json with:


name, render_readme, filename: "dist/nabu-eyes-dashboard-card.js".


If distributing via release assets only, set "zip_release": true if you zip assets.




Each GitHub Release must attach both:


dist/nabu-eyes-dashboard-card.js


dist/nabu-eyes-dashboard-card.js.gz




README includes HACS install + manual resource URL:
/hacsfiles/nabu-eyes-voice-avatar/nabu-eyes-dashboard-card.js


Tag, package.json version, and HACS metadata stay in sync.



5) Branching, Versioning, Changelog


Branches:


main: always releasable


feature/*: new features


fix/*: bug fixes only




SemVer: MAJOR.MINOR.PATCH.


Changelog: Root CHANGELOG.md in Keep a Changelog style with a top ## [Unreleased] section (Added/Changed/Fixed/Removed).


Auto-Changelog Policy


Release automation promotes ## [Unreleased] → ## [x.y.z] - YYYY-MM-DD and re-seeds a fresh Unreleased block.


Script: tools/update-changelog.js


Typical usage:
node ./tools/update-changelog.js --version 0.0.3 --write
(CI can add --commit --tag when appropriate.)




Never hand-edit past releases retroactively; new changes go into Unreleased.



6) PR Policy — Build → Verify → Clean (source-only PRs)
Goal: Prove the build without committing artifacts.
Required PR steps (local or CI):
# Reset & install
rm -rf node_modules dist
npm ci

# Quality gates
npm run lint

# Build /src -> /dist
npm run build

# Verify required outputs
test -f dist/nabu-eyes-dashboard-card.js
test -f dist/nabu-eyes-dashboard-card.js.gz
node -e "const fs=require('fs');if(!fs.statSync('dist/nabu-eyes-dashboard-card.js').size)process.exit(1)"

# Optional HACS pointer sanity (structure only)
test -f hacs.json
node -e "const j=require('./hacs.json');if(!(j.filename||'').includes('dist/nabu-eyes-dashboard-card.js'))process.exit(1)"

# Clean so the PR remains source-only
rm -rf dist

PR checklist


 Lint passes (0 warnings).


 Build produced .js + .gz and they were removed before commit.


 Tests green.


 No gratuitous deps; licenses OK.


 CHANGELOG.md + docs updated for user-visible changes.



7) Workflow Contract (all four must run)
Keep all four workflows under .github/workflows/ green:


build.yml — PR build check (source-only)


Trigger: pull_request → main.


Steps: npm ci → npm run lint → npm run build → verify .js & .gz → remove dist/.


Purpose: Prove PR can build; artifacts never land in branch.




validate.yml — validation & policy checks


Trigger: pull_request and/or push.


Tasks: schema/format, tsc --noEmit, repo structure checks.


Rule: HACS “full release” validation that expects artifacts must be skipped on PRs; enable that on tags.




release.yml — tag-driven release (uploads assets)


Trigger: push on tags like v*.


Steps: npm ci → npm run build → verify .js & .gz → upload both assets to the GitHub Release → optional HACS validation on the tag.




build-release.yml — combined build + publish flow


Trigger: workflow_dispatch and/or tags/branches as configured.


May also bump versions, create changelog entries, or push tags.


Must still produce .js + .gz, upload to the Release, and (if configured) run HACS validation.





If a job is intentionally skipped (e.g., full HACS release check on PRs), document it with if: guards and a brief note.


8) Release Workflow (assets live on the Release)


Bump version in package.json (only if different).


Advance changelog:
node ./tools/update-changelog.js --version <x.y.z> --write
(CI can add --commit --tag to commit the change and create an annotated tag.)


Build: npm run build → produces .js + .gz in dist/.


Publish: Attach both files to the GitHub Release for the tag.


Validate: Run HACS validation against the tag.



Releases must not rely on stale dist/. Build fresh each time.


9) Voice & Interaction Rules


Keep responses concise and contextual; no filler.


Avatar state transitions reflect system/sensor events.


Unknown states handled gracefully (silent/unavailable).


Use readonly string[] or literal unions for active states; don’t assign immutable arrays to mutable fields.



10) Security & Privacy


Never log private audio/PII.


Provide opt-in/out for voice logging.


Keep deps current; run npm audit regularly.



11) Roadmap & Limits


Current: HA + AWTRIX3/Ulanzi.


Planned: Multi-language TTS, offline voice engine, better lip-sync, mobile dashboard.


Track via GitHub Projects with roadmap label.



12) Escalation
If blocked:


Label needs-spec or blocked.


State exactly what’s missing (API, design, asset, access).


Tag repo owner.



13) Definition of Done


Build verified; .js + .gz produced and cleaned for PRs.


All four workflows satisfied according to their contracts.


HACS compliance intact.


Changelog + docs updated (auto-promoted on release).


Tag published with release assets on production release.



File placement


AGENTS.md: repo root


CHANGELOG.md: repo root (## [Unreleased] always present)


Sources: ./src/** only


Build outputs: ./dist/** only (generated, not committed in PRs)



Dev release:
npm run build && npm run release:dev -- 1.0.327-dev.0

Production release:
npm run build && npm run release -- 1.0.327.

