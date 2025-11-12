// tools/update-changelog.js
// Advance CHANGELOG.md from "Unreleased" -> [x.y.z] - YYYY-MM-DD and re-seed Unreleased.
//
// Usage:
//   node ./tools/update-changelog.js --version 0.0.3 [--write] [--commit] [--tag]
// Default is dry-run (prints result to stdout). Use --write to modify the file in-place.

import fs from "node:fs";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const getArg = (k, d = null) => {
  const i = args.findIndex((a) => a === `--${k}`);
  if (i === -1) return d;
  const v = args[i + 1];
  if (!v || v.startsWith("--")) return true; // boolean flag
  return v;
};

const rawVersion = getArg("version");
if (!rawVersion) {
  console.error("❌  Missing --version x.y.z");
  process.exit(1);
}
const normalizedVersion = rawVersion.startsWith("v")
  ? rawVersion.slice(1)
  : rawVersion;
if (!normalizedVersion) {
  console.error("❌  Invalid version supplied");
  process.exit(1);
}
const write = !!getArg("write");
const doCommit = !!getArg("commit");
const doTag = !!getArg("tag");

const CHANGELOG = "CHANGELOG.md";
if (!fs.existsSync(CHANGELOG)) {
  console.error(`❌  ${CHANGELOG} not found`);
  process.exit(1);
}

const isoDate = new Date().toISOString().slice(0, 10);
const raw = fs.readFileSync(CHANGELOG, "utf8");

// Basic Keep a Changelog scaffolds if file is empty/minimal
const headerNeeded =
  !raw.includes("# Changelog") || !raw.match(/\n## \[Unreleased\]/);

const scaffold = `# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- 
### Changed
- 
### Fixed
- 
### Removed
- 

`;

let text = raw;
if (headerNeeded) {
  text = scaffold + raw;
}

// If there is already a section for this version, do nothing to sections
const hasTarget = text.includes(`## [${normalizedVersion}]`);
if (!hasTarget) {
  // Move Unreleased -> [version] - date, re-seed Unreleased
  const unreleasedRe = /## \[Unreleased\][\s\S]*?(?=^## \[|^$)/m;
  const match = text.match(unreleasedRe);
  if (!match) {
    console.error("❌  Could not find '## [Unreleased]' section.");
    process.exit(1);
  }
  const unreleasedBlock = match[0];

  // Strip the "Unreleased" heading from the captured block
  const body = unreleasedBlock.replace(/^## \[Unreleased\]\s*\n?/, "");

  const newVersionBlock = `## [${normalizedVersion}] - ${isoDate}\n${body.trimEnd()}\n\n`;
  const newUnreleasedBlock = `## [Unreleased]\n### Added\n- \n### Changed\n- \n### Fixed\n- \n### Removed\n- \n\n`;

  text = text.replace(unreleasedRe, newUnreleasedBlock + newVersionBlock);
}

// Output or write
if (write) {
  fs.writeFileSync(CHANGELOG, text);
  console.log(
    `✅  CHANGELOG advanced to [${normalizedVersion}] and Unreleased re-seeded`,
  );
} else {
  console.log(text);
}

// Optional commit + tag
if (write && doCommit) {
  execSync("git add CHANGELOG.md", { stdio: "inherit" });
  execSync(`git commit -m "chore(changelog): advance to ${normalizedVersion}"`, {
    stdio: "inherit",
  });
  if (doTag) {
    const tag = rawVersion.startsWith("v") ? rawVersion : `v${normalizedVersion}`;
    execSync(`git tag -a ${tag} -m "Release ${tag}"`, { stdio: "inherit" });
  }
}
