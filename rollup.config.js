/* eslint-env node */
// rollup.config.js

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

// --- Load version from package.json ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgJsonPath = resolvePath(__dirname, 'package.json');
const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
const CARD_VERSION = pkg.version || 'dev';

export default {
  input: 'src/nabu-eyes-dashboard-card.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    entryFileNames: 'nabu-eyes-dashboard-card.js',

    // Runs before the bundle; exposes the version your card reads
    intro: `
      if (typeof window !== 'undefined') {
        window.__NABU_EYES_DASHBOARD_CARD_VERSION__ = '${CARD_VERSION}';
      }
    `,
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),
    // Copy GIF/assets into dist so HACS serves them under /hacsfiles/<repo>/...
    copy({
      targets: [{ src: 'src/nabu_eyes_dashboard/**', dest: 'dist/nabu_eyes_dashboard' }],
      // copyOnce: true, // enable if you only want copying on first build in watch mode
    }),
    ...(production ? [terser()] : []),
  ],
};
