import * as espree from 'espree';
import ts from 'typescript';

/**
 * Lightweight TypeScript-aware parser for ESLint that transpiles source files
 * with the TypeScript compiler before handing the output to Espree. This
 * mirrors the behaviour of the bespoke parser that previously lived in the
 * repository while exposing an ES module entry so Node.js can load it when the
 * project is configured with "type": "module".
 */

const DEFAULT_COMPILER_OPTIONS = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2022,
  jsx: ts.JsxEmit.Preserve,
  sourceMap: false,
  inlineSourceMap: false,
  importHelpers: false
};

function transpile(code, filePath) {
  const result = ts.transpileModule(code, {
    compilerOptions: DEFAULT_COMPILER_OPTIONS,
    fileName: filePath
  });
  return result.outputText;
}

function resolveFilePath(options) {
  if (!options) {
    return '<input.ts>';
  }

  return options.filePath || options.filepath || options.fileName || options.filename || '<input.ts>';
}

function buildParserOptions(options = {}) {
  const base = {
    range: true,
    loc: true,
    tokens: true,
    comment: true,
    ecmaVersion: options.ecmaVersion ?? 'latest',
    sourceType: options.sourceType ?? 'module',
    ecmaFeatures: {
      ...(options.ecmaFeatures ?? {}),
      jsx: true
    }
  };

  if (options.allowReserved !== undefined) {
    base.allowReserved = options.allowReserved;
  }

  if (options.allowReturnOutsideFunction !== undefined) {
    base.allowReturnOutsideFunction = options.allowReturnOutsideFunction;
  }

  if (options.allowImportExportEverywhere !== undefined) {
    base.allowImportExportEverywhere = options.allowImportExportEverywhere;
  }

  if (options.globalReturn !== undefined) {
    base.globalReturn = options.globalReturn;
  }

  return base;
}

/**
 * Parses the provided TypeScript code and returns an ESTree-compatible AST for
 * ESLint consumers.
 *
 * @param {string} code - The TypeScript source text to parse.
 * @param {import('espree').Options} [options] - Parser configuration supplied
 *   by ESLint.
 * @returns {import('espree').Program} ESTree program node describing the
 *   transpiled source.
 */
export function parse(code, options = {}) {
  return parseForESLint(code, options).ast;
}

/**
 * ESLint entry point that returns the AST alongside helper services describing
 * the original file name and the intermediate transpiled output.
 *
 * @param {string} code - The TypeScript source text to parse.
 * @param {import('espree').Options} [options] - Parser configuration supplied
 *   by ESLint.
 * @returns {import('eslint').Linter.ESLintParseResult} Object describing the
 *   AST and parser services for ESLint.
 */
export function parseForESLint(code, options = {}) {
  const filePath = resolveFilePath(options);
  const transpiled = transpile(code, filePath);
  const parserOptions = buildParserOptions(options);
  const ast = espree.parse(transpiled, parserOptions);

  return {
    ast,
    services: {
      getOriginalFilePath() {
        return filePath;
      },
      getTranspiledSource() {
        return transpiled;
      }
    }
  };
}

export default {
  parse,
  parseForESLint
};
