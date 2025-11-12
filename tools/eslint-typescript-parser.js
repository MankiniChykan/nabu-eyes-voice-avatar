import parserModule from './eslint-typescript-parser.cjs';

const parser = parserModule && parserModule.default ? parserModule.default : parserModule;

/**
 * Proxy to the CommonJS parser implementation so ESLint can parse TypeScript
 * sources when the repository is configured for ESM.
 */
export const parse = parser.parse;

/**
 * Proxy to the CommonJS parser implementation so ESLint can access the
 * metadata helpers it expects from a TypeScript-aware parser.
 */
export const parseForESLint = parser.parseForESLint;

export default {
  parse,
  parseForESLint
};
