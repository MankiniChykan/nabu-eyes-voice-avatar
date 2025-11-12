import parserModule from './eslint-typescript-parser.cjs';

const parser = parserModule && parserModule.default ? parserModule.default : parserModule;

export const parse = parser.parse;
export const parseForESLint = parser.parseForESLint;

export default {
  parse,
  parseForESLint
};
