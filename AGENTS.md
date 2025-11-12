Got it. Here’s a **complete AGENTS.md** that bakes in the “build → verify → clean for PRs” policy **and** requires running **all four workflows** you showed (`build.yml`, `validate.yml`, `release.yml`, `build-release.yml`). Drop this at the repo root.

---

# AGENTS.md — Nabu Eyes Voice Avatar

**Repository:** `MankiniChykan/nabu-eyes-voice-avatar`
**Targets:** Home Assistant + AWTRIX3 (Ulanzi Clock)
**Mission:** Voice-feedback + avatar visualization with event-driven behavior, shipped via HACS.

---

## 1) Scope & Principles

* Deliver a reliable, lean HA dashboard card and assets.
* Prioritise: correctness → performance → maintainability → accessibility.
* Assume users are smart-home enthusiasts with moderate technical skills.

---

## 2) Repository Layout (mandatory)

* **Sources:** `./src/**` (no code outside `src/`)

  * Example: `src/nabu-eyes-dashboard-card.ts`
* **Build outputs:** `./dist/**` (generated only)

  * Required after a build:

    * `dist/nabu-eyes-dashboard-card.js`
    * `dist/nabu-eyes-dashboard-card.js.gz`
* **PRs must not commit `dist/`:** ensure `.gitignore` contains `dist/`.

---

## 3) Tooling & Coding Standards

* **Language:** TypeScript (strict). Avoid `any`; use unions and generics.
* **Bundler:** Rollup with tree-shaking.

  * Use default terser import: `import terser from '@rollup/plugin-terser'`.
* **Types & immutability:** Prefer literal unions or `readonly` arrays; don’t assign a `readonly` constant to a mutable `string[]`.
* **Docs:** JSDoc/TS docstrings for all exported APIs.
* **Style:** Prettier + ESLint must pass **with zero warnings**.
* **Tests:** Unit tests for state handling, event routing, and critical transforms.

---

## 4) HACS Compliance (non-negotiable)

* Root `hacs.json` present with:

  * `name`, `render_readme`, `filename: "dist/nabu-eyes-dashboard-card.js"`.
  * If distributing only from Releases, include `"zip_release": true`.
* Each GitHub Release **must attach both**:

  * `dist/nabu-eyes-dashboard-card.js`
  * `dist/nabu-eyes-dashboard-card.js.gz`
* README includes HACS install and manual resource URL:
  `/hacsfiles/nabu-eyes-voice-avatar/nabu-eyes-dashboard-card.js`
* Tag, `package.json` version, and HACS metadata remain in sync.

---

## 5) Branching, Versioning, Changelog

* **Branches:**

  * `main`: always releasable.
  * `feature/*`: new features.
  * `fix/*`: bug fixes only.
* **SemVer:** `MAJOR.MINOR.PATCH`.
* **Changelog:** Root `CHANGELOG.md`, top section = current version (Added/Changed/Fix/Remove).

---

## 6) PR Policy — Build-Then-Clean (keep PRs source-only)

**Objective:** Prove the build without committing artifacts.

**Script (copy/paste locally or in CI job steps):**

```bash
# Reset & install
rm -rf node_modules dist
npm ci

# Fast-fail quality gates
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

# Clean before committing so PR remains source-only
rm -rf dist
```

**PR checklist**

* [ ] Lint passes cleanly (0 warnings).
* [ ] Build produced `.js` + `.gz` and they were **removed** before commit.
* [ ] Tests green.
* [ ] No gratuitous deps; licenses OK.
* [ ] `CHANGELOG.md` + docs updated for user-visible changes.

---

## 7) Workflow Contract (all four must run)

Your `.github/workflows/` contains:

1. **`build.yml`** — PR build check (source-only)

* **Trigger:** `pull_request` to `main`.
* **Required steps:** `npm ci` → `npm run lint` → `npm run build` → verify `.js` & `.gz` → **remove `dist/`**.
* **Purpose:** Ensures PR changes can build and produce required outputs, but artifacts never land in the branch.

2. **`validate.yml`** — validation & policy checks

* **Trigger:** `pull_request` and/or `push` to branches.
* **Typical tasks:** schema/format, TypeScript `--noEmit`, optional HACS “structure only” check (do **not** require artifacts to exist on branches).
* **Rule:** HACS validation that expects artifacts must be **skipped on PRs** (no `dist/` committed). HACS full validation is allowed on tags or after assets are attached.

3. **`release.yml`** — tag-driven release (assets on Release)

* **Trigger:** `push` on tags like `v*`.
* **Required steps:** `npm ci` → `npm run build` → verify `.js` & `.gz` → upload both assets to the GitHub Release → (optional) HACS validation on the tag.
* **Outcome:** A consumable HACS release with both assets attached.

4. **`build-release.yml`** — combined build + publish flow

* **Trigger:** Either manual (`workflow_dispatch`) or tags/branch (as configured).
* **Responsibility:** Same as `release.yml`, but may also bump versions, generate changelog entries, or push tags.
* **Contract:** It must still produce `.js` + `.gz`, upload them to the Release, and (if configured) run HACS validation.

**Agent responsibility:**

* Keep all four workflows green for any change.
* If a workflow is intentionally skipped (e.g., HACS full validation on PRs), document the reason in the job condition (`if:` guards).

---

## 8) Release Workflow (assets live on the Release)

1. Bump `package.json` version.
2. Update `CHANGELOG.md`, `README.md`, and `hacs.json` (if needed).
3. Run `release.yml` or `build-release.yml` (on a tag).
4. Ensure both assets are attached:

   * `dist/nabu-eyes-dashboard-card.js`
   * `dist/nabu-eyes-dashboard-card.js.gz`
5. Confirm HACS validation passes (on the tag).

---

## 9) Voice & Interaction Rules

* Keep responses concise and contextual; no filler.
* Avatar state transitions reflect system/sensor events.
* Unknown states handled gracefully (silent/unavailable).
* Use `readonly string[]` or literal unions for active states; don’t assign immutable arrays to mutable fields.

---

## 10) Security & Privacy

* Never log private audio/PII.
* Provide opt-in/out for voice logging.
* Keep deps current; run `npm audit` regularly.

---

## 11) Roadmap & Limits

* **Current:** HA + AWTRIX3/Ulanzi.
* **Planned:** Multi-language TTS, offline voice engine, better lip-sync, mobile dashboard.
* Track via GitHub Projects with `roadmap` label.

---

## 12) Escalation

If blocked:

* Label `needs-spec` or `blocked`.
* State exactly what’s missing (API, design, asset, access).
* Tag repo owner.

---

## 13) Definition of Done

* Build verified; `.js` + `.gz` produced and cleaned for PRs.
* All four workflows satisfied according to their contracts.
* HACS compliance intact.
* Changelog + docs updated.
* Tag published with release assets on production release.

---

### File placement

* **AGENTS.md:** repo root.
* **CHANGELOG.md:** repo root.
* **Sources:** `./src/**` only.
* **Build outputs:** `./dist/**` only (generated, not committed to PRs).

---

Dev release:

```
npm run build && npm run release:dev -- 1.0.327-dev.0
```

Production release:

```
npm run build && npm run release -- 1.0.327.
```
