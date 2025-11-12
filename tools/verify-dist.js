#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

/**
 * Print an error message and exit the process with a non-zero code.
 *
 * @param {string} message - The human readable failure message.
 */
function fail(message) {
  console.error(`\u274c  ${message}`);
  process.exit(1);
}

/**
 * Recursively iterate through a directory and yield every file path.
 *
 * @param {string} directory - Absolute path to traverse.
 * @returns {string[]} Absolute paths to each discovered file.
 */
function collectFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

const projectRoot = process.cwd();
const distDirectory = path.resolve(projectRoot, 'dist');

if (!fs.existsSync(distDirectory) || !fs.statSync(distDirectory).isDirectory()) {
  fail('dist directory not found. Run "npm run build" to generate compiled assets.');
}

const bundlePath = path.join(distDirectory, 'nabu-eyes-dashboard-card.js');
if (!fs.existsSync(bundlePath)) {
  fail('Compiled bundle dist/nabu-eyes-dashboard-card.js is missing.');
}

const disallowedExtensions = new Set(['.ts', '.tsx', '.cts', '.mts']);
const distFiles = collectFiles(distDirectory);
const offendingFiles = distFiles.filter((file) =>
  disallowedExtensions.has(path.extname(file))
);

if (offendingFiles.length > 0) {
  const relativePaths = offendingFiles.map((file) => path.relative(projectRoot, file));
  fail(`TypeScript sources leaked into dist: ${relativePaths.join(', ')}`);
}

console.log('\u2705  Verified dist contains compiled JavaScript artifacts.');
