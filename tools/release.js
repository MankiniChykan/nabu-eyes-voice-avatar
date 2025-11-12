#!/usr/bin/env node
// tools/release.js — Usage: npm run release -- <version>

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sh = (cmd) => {
  console.log('$', cmd);
  execSync(cmd, { stdio: 'inherit' });
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const parseVersionArg = (argv = process.argv) => {
  const input = argv[2];
  if (!input) {
    throw new Error('Provide a version: npm run release -- x.y.z');
  }
  return input.replace(/^v/, '');
};

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

  if (!release?.upload_url) {
    console.log('ℹ️  Release detected but upload URL missing; skipping asset upload.');
    return;
  }

  const existingAssetsResponse = await apiRequest(
    fetchImpl,
    `${releasesBaseUrl}/${release.id}/assets?per_page=100`,
    { token },
  );
  const existingAssets = await existingAssetsResponse.json();
  const assetMap = new Map(existingAssets.map((asset) => [asset.name, asset.id]));

  const uploadBase = release.upload_url.replace('{?name,label}', '');
  const assetsBaseUrl = `${apiRoot}/repos/${repoSlug}/releases/assets`;

  for (const assetPath of assets) {
    if (!fsImpl.existsSync(assetPath)) {
      console.warn(`⚠️  Skipping upload for missing asset: ${assetPath}`);
      continue;
    }

    const assetName = path.basename(assetPath);
    if (assetMap.has(assetName)) {
      console.log(`ℹ️  Removing existing asset ${assetName} before upload.`);
      await apiRequest(fetchImpl, `${assetsBaseUrl}/${assetMap.get(assetName)}`, {
        token,
        method: 'DELETE',
      });
    }

    const fileBuffer = fsImpl.readFileSync(assetPath);
    const contentType = assetName.endsWith('.gz')
      ? 'application/gzip'
      : 'application/javascript';

    console.log(`⬆️  Uploading ${assetName} to GitHub release ${tagName}.`);
    await apiRequest(fetchImpl, `${uploadBase}?name=${encodeURIComponent(assetName)}`, {
      token,
      method: 'POST',
      headers: { 'Content-Type': contentType, 'Content-Length': String(fileBuffer.length) },
      body: fileBuffer,
    });
  }
};

const performRelease = async (version) => {
  const pkg = readJson('package.json');
  if ((pkg.version || '').trim() !== version) {
    sh(`npm version ${version} --no-git-tag-version`);
  } else {
    console.log('ℹ️  package.json already at target version, skipping bump');
  }

  const versionFiles = ['package.json', 'package-lock.json'];
  for (const file of versionFiles) {
    if (!fs.existsSync(file)) continue;
    try {
      sh(`git add "${file}"`);
    } catch {
      console.log(`ℹ️  Unable to stage ${file} (already staged or unchanged).`);
    }
  }

  const js = path.resolve('dist/nabu-eyes-dashboard-card.js');
  const gz = `${js}.gz`;
  if (!fs.existsSync(js) || !fs.existsSync(gz)) {
    console.error('❌  Build output not found. Run "npm run build" first.');
    process.exit(1);
  }

  // stage built assets (even if dist is gitignored)
  try {
    sh(`git add -f "${js}" "${gz}"`);
  } catch {}
  try {
    sh(`git commit -m "build: release ${version}"`);
  } catch {
    console.log('ℹ️  Nothing to commit.');
  }

  try {
    sh(`git tag -f v${version} -m "v${version}"`);
  } catch {}

  // push branch (if any changes) and ALWAYS push the tag
  try {
    sh('git push');
  } catch {}
  try {
    sh(`git push origin v${version}`);
  } catch (error) {
    console.warn(`⚠️  Unable to push tag to origin: ${error?.message || error}`);
  }

  await ensureReleaseAndUploadAssets(version, [js, gz]);
};
const main = async (argv = process.argv) => {
  const version = parseVersionArg(argv);
  await performRelease(version);
};
const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(scriptPath)) {
  main().catch((error) => {
    if (error.message === 'Provide a version: npm run release -- x.y.z') {
      console.error(`❌  ${error.message}`);
    } else {
      console.error(`❌  Release script failed: ${error.message}`);
    }
    process.exit(1);
  });
}

export {
  apiRequest,
  ensureReleaseAndUploadAssets,
  guessRepoSlug,
  main,
  parseVersionArg,
  performRelease,
  resolveGitHubToken,
};
