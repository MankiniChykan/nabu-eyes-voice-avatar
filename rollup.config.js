/* eslint-env node */
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/nabu-eyes-dashboard-card.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    entryFileNames: 'nabu-eyes-dashboard-card.js',
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
      // copyOnce: true, // uncomment if you only want copying on first build in watch mode
    }),
    ...(production ? [terser()] : []),
  ],
};
