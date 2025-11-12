import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { ensureReleaseAndUploadAssets } from '../release.mjs';

test('skips upload when token is missing', async () => {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'release-test-skip-'));
  const asset = path.join(tempDir, 'nabu-eyes-dashboard-card.js');
  const gz = `${asset}.gz`;
  fs.writeFileSync(asset, 'console.log("hi");');
  fs.writeFileSync(gz, 'gz-data');

  let fetchCalls = 0;
  const fetchImpl = async () => {
    fetchCalls += 1;
    return new Response('', { status: 200 });
  };

  await ensureReleaseAndUploadAssets('0.0.7', [asset, gz], {
    token: undefined,
    repoSlug: 'owner/repo',
    fetchImpl,
  });

  assert.equal(fetchCalls, 0, 'fetch should not be called when token is missing');
});

test('creates a release and uploads assets when required', async () => {
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'release-test-upload-'));
  const asset = path.join(tempDir, 'nabu-eyes-dashboard-card.js');
  const gz = `${asset}.gz`;
  const gif = path.join(tempDir, 'nabu_idle_preview_dash.gif');
  fs.writeFileSync(asset, 'console.log("hi");');
  fs.writeFileSync(gz, 'gz-data');
  fs.writeFileSync(gif, 'gif-data');

  const zip = path.join(tempDir, 'nabu-eyes-dashboard-card.zip');
  fs.writeFileSync(zip, 'zip-data');

  const responses = [
    new Response('', { status: 404, statusText: 'Not Found' }),
    new Response(
      JSON.stringify({
        id: 123,
        upload_url:
          'https://uploads.github.com/repos/owner/repo/releases/123/assets{?name,label}',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      },
    ),
    new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
    new Response('', { status: 201 }),
    new Response('', { status: 201 }),
    new Response('', { status: 201 }),
    new Response('', { status: 201 }),
  ];

  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    const response = responses.shift();
    if (!response) {
      throw new Error(`Unexpected fetch for ${url}`);
    }
    return response;
  };

  const execCalls = [];
  const execImpl = (command) => {
    execCalls.push(command);
    if (command.startsWith('git rev-parse')) {
      return 'abcdef1234567890abcdef1234567890abcdef12\n';
    }
    if (command.startsWith('git config --get remote.origin.url')) {
      return 'https://github.com/owner/repo.git\n';
    }
    throw new Error(`Unexpected exec command: ${command}`);
  };

  await ensureReleaseAndUploadAssets(
    '0.0.7',
    [
      { path: asset, name: 'dist/nabu-eyes-dashboard-card.js' },
      { path: gz, name: 'dist/nabu-eyes-dashboard-card.js.gz' },
      gif,
      zip,
    ],
    {
      token: 'abc123',
      repoSlug: 'owner/repo',
      fetchImpl,
      execImpl,
      fsImpl: fs,
    },
  );

  assert.deepEqual(execCalls, ['git rev-parse HEAD']);
  assert.equal(calls.length, 7);
  assert.match(calls[0].url, /\/tags\/v0\.0\.7$/);
  assert.match(calls[1].url, /\/repos\/owner\/repo\/releases$/);
  assert.match(calls[3].url, /name=dist%2Fnabu-eyes-dashboard-card\.js$/);
  assert.match(calls[4].url, /name=dist%2Fnabu-eyes-dashboard-card\.js\.gz$/);
  assert.match(calls[5].url, /name=nabu_idle_preview_dash\.gif$/);
  assert.equal(calls[5].options?.headers?.['Content-Type'], 'image/gif');
  assert.match(calls[6].url, /name=nabu-eyes-dashboard-card\.zip$/);
  assert.equal(calls[6].options?.headers?.['Content-Type'], 'application\/zip');
});
