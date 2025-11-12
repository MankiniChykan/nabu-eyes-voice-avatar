#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

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

const distDir = path.resolve(process.cwd(), 'dist');
const distJsPath = path.join(distDir, 'nabu-eyes-dashboard-card.js');
const distGzipPath = `${distJsPath}.gz`;

if (!existsSync(distJsPath) || !existsSync(distGzipPath)) {
  fail('Build output not found. Run "npm run build" before creating a release.');
}

if (!isDevRelease) {
  const changelogPath = path.resolve(process.cwd(), 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    fail('CHANGELOG.md is missing. Add a changelog entry before releasing.');
  }

  const changelog = readFileSync(changelogPath, 'utf8');
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
