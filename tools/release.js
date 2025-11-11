#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

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
