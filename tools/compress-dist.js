#!/usr/bin/env node
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INPUT_FILENAME = 'nabu-eyes-dashboard-card.js';
const INPUT_PATH = path.join(DIST_DIR, INPUT_FILENAME);
const OUTPUT_PATH = `${INPUT_PATH}.gz`;

function assertBuildOutput() {
  if (!existsSync(INPUT_PATH)) {
    throw new Error(`Build output not found at ${INPUT_PATH}. Run "npm run build" first.`);
  }
}

async function compressBundle() {
  assertBuildOutput();

  await pipeline(createReadStream(INPUT_PATH), createGzip({ level: 9 }), createWriteStream(OUTPUT_PATH));

  console.log(`\u2705  Created ${OUTPUT_PATH}`);
}

compressBundle().catch((error) => {
  console.error(`\u274c  Failed to create gzip bundle: ${error.message}`);
  process.exitCode = 1;
});
