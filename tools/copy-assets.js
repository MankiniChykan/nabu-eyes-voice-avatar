#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const SOURCE_DIR = path.resolve(process.cwd(), 'src/assets/nabu_eyes_dashboard');
const TARGET_DIR = path.resolve(process.cwd(), 'dist/nabu_eyes_dashboard');

function ensureTargetDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function copyAssets(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    console.warn(`⚠️  Asset source directory not found: ${sourceDir}`);
    return;
  }

  ensureTargetDir(targetDir);

  for (const entry of readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, entry);
    const targetPath = path.join(targetDir, entry);
    const stats = statSync(sourcePath);

    if (stats.isDirectory()) {
      copyAssets(sourcePath, targetPath);
    } else {
      cpSync(sourcePath, targetPath, { force: true });
      console.log(`📁  Copied asset ${sourcePath} -> ${targetPath}`);
    }
  }
}

copyAssets(SOURCE_DIR, TARGET_DIR);
