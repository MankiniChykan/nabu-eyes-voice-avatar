#!/usr/bin/env node
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true, force: true });
  console.log(`\u267B\uFE0F  Removed existing ${DIST_DIR}`);
}
