#!/usr/bin/env node
// tools/release.js — Usage: npm run release -- <version>

import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultFetch = globalThis.fetch;

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

const resolveGitHubToken = (env = process.env) =>
  env.GITHUB_TOKEN || env.GH_TOKEN || env.GITHUB_AUTH_TOKEN || env.GITHUB_ACCESS_TOKEN;

const defaultExec = (command) =>
  execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const guessRepoSlug = (execImpl = defaultExec, env = process.env) => {
  if (env.GITHUB_REPOSITORY) {
    return env.GITHUB_REPOSITORY;
  }

  try {
    const remoteUrl = execImpl('git config --get remote.origin.url').trim();
    const sshMatch = remoteUrl.match(/^[^@]+@[^:]+:(?<owner>[^/]+)\/(?<repo>.+?)\.git$/u);
    if (sshMatch?.groups) {
      return `${sshMatch.groups.owner}/${sshMatch.groups.repo}`;
    }

    const httpsMatch = remoteUrl.match(/^https?:\/\/(?<host>[^/]+)\/(?<owner>[^/]+)\/(?<repo>.+?)(?:\.git)?$/u);
    if (httpsMatch?.groups) {
      return `${httpsMatch.groups.owner}/${httpsMatch.groups.repo}`;
    }
  } catch (error) {
    console.warn(`⚠️  Unable to infer repository slug: ${error?.message || error}`);
  }

  return undefined;
};

const apiRequest = async (
  fetchImpl,
  url,
  { token, method = 'GET', headers = {}, body, allowNotFound = false } = {},
) => {
  const requestHeaders = {
    Accept: 'application/vnd.github+json',
    ...headers,
  };
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetchImpl(url, {
    method,
    headers: requestHeaders,
    body,
  });

  if (response.status === 404 && allowNotFound) {
    return response;
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `GitHub API request failed (${response.status} ${response.statusText}) for ${url}: ${message || 'no body'}`,
    );
  }

  return response;
};

const guessContentType = (assetName) => {
  if (assetName.endsWith('.gz')) {
    return 'application/gzip';
  }
  if (assetName.endsWith('.js')) {
    return 'application/javascript';
  }
  if (assetName.endsWith('.gif')) {
    return 'image/gif';
  }
  if (assetName.endsWith('.zip')) {
    return 'application/zip';
  }
  return 'application/octet-stream';
};
const prepareBundleDirectory = (distDir, { fsImpl = fs } = {}) => {
  if (!fsImpl.existsSync(distDir)) {
    throw new Error(`Distribution directory missing: ${distDir}`);
  }

  const bundleRoot = fsImpl.mkdtempSync(path.join(os.tmpdir(), 'nabu-eyes-dist-'));
  const cleanup = () => {
    fsImpl.rmSync(bundleRoot, { recursive: true, force: true });
  };

  const jsFile = path.join(distDir, 'nabu-eyes-dashboard-card.js');
  const gzFile = `${jsFile}.gz`;
  const assetDir = path.join(distDir, 'nabu_eyes_dashboard');

  fsImpl.cpSync(jsFile, path.join(bundleRoot, path.basename(jsFile)), { recursive: false });
  if (fsImpl.existsSync(gzFile)) {
    fsImpl.cpSync(gzFile, path.join(bundleRoot, path.basename(gzFile)), { recursive: false });
  }

  if (fsImpl.existsSync(assetDir)) {
    fsImpl.cpSync(assetDir, path.join(bundleRoot, path.basename(assetDir)), { recursive: true });
  }

  const nestedDist = path.join(bundleRoot, 'dist');
  fsImpl.mkdirSync(nestedDist, { recursive: true });
  fsImpl.cpSync(distDir, nestedDist, { recursive: true });

  return { bundleRoot, cleanup };
};

const zipDirectory = (sourceDir, outputFile, { fsImpl = fs, spawnSyncImpl = spawnSync } = {}) => {
  if (!fsImpl.existsSync(sourceDir)) {
    throw new Error(`Source directory missing: ${sourceDir}`);
  }

  const zipArgs = ['-r', outputFile, '.'];
  const result = spawnSyncImpl('zip', zipArgs, { cwd: sourceDir, stdio: 'inherit' });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`zip command failed with exit code ${result.status}`);
  }
};

const collectFilesRecursively = (directory, fsImpl = fs) => {
  const collected = [];
  if (!directory || !fsImpl.existsSync(directory)) {
    return collected;
  }

  for (const entry of fsImpl.readdirSync(directory)) {
    const resolved = path.join(directory, entry);
    const stats = fsImpl.statSync(resolved);
    if (stats.isDirectory()) {
      collected.push(...collectFilesRecursively(resolved, fsImpl));
    } else {
      collected.push(resolved);
    }
  }

  return collected;
};

const ensureReleaseAndUploadAssets = async (
  version,
  assets,
  {
    token = resolveGitHubToken(),
    fetchImpl = defaultFetch,
    execImpl = defaultExec,
    repoSlug = guessRepoSlug(execImpl),
    fsImpl = fs,
    apiRoot = 'https://api.github.com',
  } = {},
) => {
  if (!token) {
    console.log('ℹ️  No GitHub token detected; skipping release asset upload.');
    return;
  }

  if (!fetchImpl) {
    console.warn('⚠️  No fetch implementation available; skipping release asset upload.');
    return;
  }

  if (!repoSlug) {
    console.warn('⚠️  Unable to determine repository slug; skipping release asset upload.');
    return;
  }

  const tagName = version.startsWith('v') ? version : `v${version}`;
  const releasesBaseUrl = `${apiRoot}/repos/${repoSlug}/releases`;
  let release;

  const tagResponse = await apiRequest(fetchImpl, `${releasesBaseUrl}/tags/${tagName}`, {
    token,
    allowNotFound: true,
  });

  if (tagResponse.status === 404) {
    const commitSha = execImpl('git rev-parse HEAD');
    const createResponse = await apiRequest(fetchImpl, releasesBaseUrl, {
      token,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_name: tagName,
        target_commitish: commitSha,
        name: tagName,
        draft: false,
        prerelease: version.includes('-'),
      }),
    });
    release = await createResponse.json();
  } else {
    release = await tagResponse.json();
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
    const contentType = guessContentType(assetName);

    console.log(`⬆️  Uploading ${assetName} to GitHub release ${tagName}.`);
    await apiRequest(fetchImpl, `${uploadBase}?name=${encodeURIComponent(assetName)}`, {
      token,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileBuffer.length),
      },
      body: fileBuffer,
    });
  }
};

const performRelease = async (version, options = {}) => {
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

  const assetDir = path.resolve('dist/nabu_eyes_dashboard');
  const assetFiles = collectFilesRecursively(assetDir);
  const distDir = path.resolve('dist');
  const zipPath = path.resolve(distDir, 'nabu-eyes-dashboard-card.zip');

  fs.rmSync(zipPath, { force: true });

  let cleanupBundle;
  try {
    const bundle = prepareBundleDirectory(distDir);
    cleanupBundle = bundle.cleanup;
    zipDirectory(bundle.bundleRoot, zipPath);
    console.log(`🗜️  Packaged dist assets into ${zipPath}`);
  } catch (error) {
    cleanupBundle?.();
    console.error(`❌  Unable to package dist assets: ${error.message}`);
    process.exit(1);
  } finally {
    cleanupBundle?.();
  }

  try {
    const forceAddTargets = [`"${js}"`, `"${gz}"`, ...(assetFiles.map((file) => `"${file}"`))];
    sh(`git add -f ${forceAddTargets.join(' ')}`);
  } catch {}
  try {
    sh(`git commit -m "build: release ${version}"`);
  } catch {
    console.log('ℹ️  Nothing to commit.');
  }

  try {
    sh(`git tag -f v${version} -m "v${version}"`);
  } catch {}

  try {
    sh('git push');
  } catch {}
  try {
    sh(`git push origin v${version}`);
  } catch (error) {
    console.warn(`⚠️  Unable to push tag to origin: ${error?.message || error}`);
  }

  await ensureReleaseAndUploadAssets(version, [js, gz, ...assetFiles, zipPath], options);
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
