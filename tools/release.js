#!/usr/bin/env node
import { fileURLToPath } from 'node:url';

const releaseModuleUrl = new URL('./release.mjs', import.meta.url);

const run = async () => {
  const modulePath = fileURLToPath(releaseModuleUrl);
  const releaseModule = await import(releaseModuleUrl.href);
  const main = releaseModule?.main;

  if (typeof main !== 'function') {
    throw new Error(`Release module ${modulePath} does not export a main() function.`);
  }

  try {
    await main(process.argv);
  } catch (error) {
    const message = error?.message || String(error);
    if (message === 'Provide a version: npm run release -- x.y.z') {
      console.error(`❌  ${message}`);
    } else {
      console.error(`❌  Release script failed: ${message}`);
    }
    process.exit(1);
  }
};

run().catch((error) => {
  const message = error?.message || String(error);
  console.error(`❌  Unable to load release module: ${message}`);
  process.exit(1);
});
