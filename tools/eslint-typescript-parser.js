import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const parser = require('./eslint-typescript-parser.cjs');

export const parse = parser.parse;
export const parseForESLint = parser.parseForESLint;

export default {
  parse,
  parseForESLint
};
