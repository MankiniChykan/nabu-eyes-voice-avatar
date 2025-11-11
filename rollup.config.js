import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

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
    production && terser(),
  ],
};
