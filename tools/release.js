#!/usr/bin/env node
// tools/release.js — Usage: npm run release -- <version>

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
  console.error('❌  Provide a version: npm run release -- x.y.z');
  process.exit(1);
}
const version = input.replace(/^v/, '');

const sh = (cmd) => { console.log('$', cmd); execSync(cmd, { stdio: 'inherit' }); };

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if ((pkg.version || '').trim() !== version) {
  sh(`npm version ${version} --no-git-tag-version`);
} else {
  console.log('ℹ️  package.json already at target version, skipping bump');
}

const stagedVersionFiles = ['package.json', 'package-lock.json'].filter((file) =>
  fs.existsSync(file),
);
if (stagedVersionFiles.length > 0) {
  try {
    sh(`git add ${stagedVersionFiles.map((file) => `"${file}"`).join(' ')}`);
  } catch {
    console.log('ℹ️  Unable to stage version files (already staged or unchanged).');
  }
}

const js = path.resolve('dist/nabu-eyes-dashboard-card.js');
const gz = `${js}.gz`;
if (!fs.existsSync(js) || !fs.existsSync(gz)) {
  console.error('❌  Build output not found. Run "npm run build" first.');
  process.exit(1);
}

// stage built assets (even if dist is gitignored)
try { sh(`git add -f "${js}" "${gz}"`); } catch {}
try { sh(`git commit -m "build: release ${version}"`); } catch { console.log('ℹ️  Nothing to commit.'); }

try { sh(`git tag -f v${version} -m "v${version}"`); } catch {}

// push branch (if any changes) and ALWAYS push the tag
try { sh('git push'); } catch {}
sh(`git push origin v${version}`);
