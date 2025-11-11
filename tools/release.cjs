#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function parseSemver(value) {
  const match = value.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/u);
  if (!match) {
    return null;
  }

  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
    prerelease: match[4] ?? null
  };
}

function compareIdentifiers(a, b) {
  if (a === b) {
    return 0;
  }

  const numericA = /^\d+$/u.test(a);
  const numericB = /^\d+$/u.test(b);

  if (numericA && numericB) {
    return Number.parseInt(a, 10) - Number.parseInt(b, 10);
  }

  if (numericA) {
    return -1;
  }

  if (numericB) {
    return 1;
  }

  return a.localeCompare(b);
}

function comparePrerelease(aIdentifiers, bIdentifiers) {
  const length = Math.max(aIdentifiers.length, bIdentifiers.length);

  for (let index = 0; index < length; index += 1) {
    const aId = aIdentifiers[index];
    const bId = bIdentifiers[index];

    if (aId === undefined) {
      return -1;
    }

    if (bId === undefined) {
      return 1;
    }

    const diff = compareIdentifiers(aId, bId);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
}

function compareSemver(a, b) {
  if (a.major !== b.major) {
    return a.major - b.major;
  }

  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }

  if (a.patch !== b.patch) {
    return a.patch - b.patch;
  }

  if (a.prerelease === b.prerelease) {
    return 0;
  }

  if (a.prerelease === null) {
    return 1;
  }

  if (b.prerelease === null) {
    return -1;
  }

  const aIdentifiers = a.prerelease.split('.');
  const bIdentifiers = b.prerelease.split('.');

  return comparePrerelease(aIdentifiers, bIdentifiers);
}

function fail(message) {
  console.error(`\u274c  ${message}`);
  process.exit(1);
}

const lifecycleEvent = process.env.npm_lifecycle_event || '';
const isDevRelease = lifecycleEvent === 'release:dev';
const usage = isDevRelease
  ? 'Usage: npm run release:dev -- <version>'
  : 'Usage: npm run release -- <version>';
const args = process.argv.slice(2);

if (args.length === 0 || !args[0]) {
  fail(usage);
}

const version = args[0].trim();
const stablePattern = /^\d+\.\d+\.\d+$/u;
const prereleasePattern = /^\d+\.\d+\.\d+-[0-9A-Za-z.-]+$/u;

if (isDevRelease) {
  if (!stablePattern.test(version) && !prereleasePattern.test(version)) {
    fail(`Invalid dev release version "${version}". Use semantic versioning (e.g. 1.2.3-dev.0).`);
  }
} else if (!stablePattern.test(version)) {
  fail(`Invalid release version "${version}". Use semantic versioning (e.g. 1.2.3).`);
}

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  fail(`Unable to read package.json: ${error.message}`);
}

if (!packageJson.version) {
  fail('package.json must define a version.');
}

const currentVersionInfo = parseSemver(packageJson.version);
const requestedVersionInfo = parseSemver(version);

if (!requestedVersionInfo) {
  fail(`Unable to parse target version "${version}".`);
}

if (!currentVersionInfo) {
  fail(`Unable to parse current package version "${packageJson.version}".`);
}

if (!isDevRelease && requestedVersionInfo.prerelease) {
  fail('Use "npm run release:dev" for prerelease versions.');
}

const versionComparison = compareSemver(requestedVersionInfo, currentVersionInfo);

if (versionComparison < 0) {
  const sameBaseVersion =
    requestedVersionInfo.major === currentVersionInfo.major &&
    requestedVersionInfo.minor === currentVersionInfo.minor &&
    requestedVersionInfo.patch === currentVersionInfo.patch;

  const downgradeAllowed =
    isDevRelease &&
    sameBaseVersion &&
    requestedVersionInfo.prerelease !== null &&
    currentVersionInfo.prerelease === null;

  if (!downgradeAllowed) {
    fail(
      `Target version ${version} cannot be lower than current package version ${packageJson.version}.`
    );
  }
}

if (!isDevRelease && versionComparison === 0) {
  fail(`Release version ${version} must be greater than the current package version.`);
}

if (
  isDevRelease &&
  requestedVersionInfo.prerelease !== null &&
  currentVersionInfo.prerelease !== null &&
  compareSemver(requestedVersionInfo, currentVersionInfo) <= 0
) {
  fail(
    `Dev release version ${version} must increase compared to current prerelease ${packageJson.version}.`
  );
}

const distPath = path.resolve(process.cwd(), 'dist', 'nabu-eyes-dashboard-card.js');
if (!fs.existsSync(distPath)) {
  fail('Build output not found. Run "npm run build" before creating a release.');
}

const hacsConfigPath = path.resolve(process.cwd(), 'hacs.json');
if (!fs.existsSync(hacsConfigPath)) {
  fail('hacs.json is missing. Ensure the repository is HACS-compliant before releasing.');
}

let hacsConfig;
try {
  hacsConfig = JSON.parse(fs.readFileSync(hacsConfigPath, 'utf8'));
} catch (error) {
  fail(`Unable to parse hacs.json: ${error.message}`);
}

if (!hacsConfig.filename || typeof hacsConfig.filename !== 'string') {
  fail('hacs.json must define a "filename" pointing to the built bundle.');
}

const hacsBundlePath = path.resolve(process.cwd(), hacsConfig.filename);
if (hacsBundlePath !== distPath) {
  fail('hacs.json filename must reference dist/nabu-eyes-dashboard-card.js.');
}

if (!isDevRelease) {
  const changelogPath = path.resolve(process.cwd(), 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    fail('CHANGELOG.md is missing. Add a changelog entry before releasing.');
  }

  const changelog = fs.readFileSync(changelogPath, 'utf8');
  if (!changelog.includes(`[${version}]`)) {
    fail(`CHANGELOG.md does not include an entry for [${version}].`);
  }
}

try {
  execSync(`npm version ${version} --no-git-tag-version`, { stdio: 'inherit' });
} catch (error) {
  fail(`npm version failed: ${error.message}`);
}

console.log(`\u2705  Release version set to ${version}`);

