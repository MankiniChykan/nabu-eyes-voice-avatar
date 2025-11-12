const ts = require('typescript');
const espree = require('espree');
const eslintScope = require('eslint-scope');
const { visitorKeys: defaultVisitorKeys } = require('eslint-visitor-keys');

const DEFAULT_COMPILER_OPTIONS = {
  target: ts.ScriptTarget.ES2021,
  module: ts.ModuleKind.ESNext,
  jsx: ts.JsxEmit.Preserve,
  useDefineForClassFields: false,
  removeComments: false,
  importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Preserve
};

function normalizeEcmaVersion(ecmaVersion) {
  if (!ecmaVersion || ecmaVersion === 'latest') {
    return 2022;
  }

  if (typeof ecmaVersion === 'string') {
    const parsed = Number.parseInt(ecmaVersion, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
    return 2022;
  }

  return ecmaVersion;
}

function createParseOptions(options = {}) {
  const ecmaVersion = normalizeEcmaVersion(options.ecmaVersion);
  return {
    ecmaVersion,
    sourceType: options.sourceType ?? 'module',
    ecmaFeatures: options.ecmaFeatures ?? {},
    loc: true,
    range: true,
    comment: true,
    tokens: true
  };
}

function transpile(code, filePath) {
  const result = ts.transpileModule(code, {
    compilerOptions: DEFAULT_COMPILER_OPTIONS,
    fileName: filePath
  });

  return result.outputText;
}

function parseInternal(code, options) {
  const filePath = options && options.filePath ? options.filePath : undefined;
  const transpiled = transpile(code, filePath);
  const parseOptions = createParseOptions(options);
  const ast = espree.parse(transpiled, parseOptions);
  const tokens = espree.tokenize(transpiled, parseOptions);
  const comments = ast.comments ?? [];
  const scopeManager = eslintScope.analyze(ast, {
    ecmaVersion: parseOptions.ecmaVersion,
    sourceType: parseOptions.sourceType,
    ecmaFeatures: parseOptions.ecmaFeatures,
    ignoreEval: true,
    impliedStrict: parseOptions.sourceType === 'module'
  });

  return { ast, tokens, comments, scopeManager, transpiled };
}

/**
 * Parse TypeScript-flavoured source into an ESTree-compatible abstract syntax
 * tree by transpiling with the local TypeScript compiler and delegating to
 * Espree.
 *
 * @param {string} code - The source code provided to the parser.
 * @param {import('eslint').ParserOptions} [options] - ESLint parser options.
 * @returns {import('estree').Program} Program node representing the provided code.
 */
function parse(code, options) {
  return parseInternal(code, options).ast;
}

/**
 * Parse TypeScript source and return the metadata shape required by
 * {@link https://eslint.org/docs/latest/integrate/nodejs-api#custom-parser|ESLint custom parsers}.
 * Includes visitor keys, scope manager and helper services so lint rules can
 * interact with the transpiled program.
 *
 * @param {string} code - The source code provided to the parser.
 * @param {import('eslint').ParserOptions} [options] - ESLint parser options.
 * @returns {import('@typescript-eslint/parser').ParseForESLintResult} ESLint parse result augmented with helper services.
 */
function parseForESLint(code, options = {}) {
  const { ast, tokens, comments, scopeManager, transpiled } = parseInternal(
    code,
    options
  );

  return {
    ast,
    tokens,
    comments,
    scopeManager,
    visitorKeys: defaultVisitorKeys,
    services: {
      getTranspiledSource() {
        return transpiled;
      }
    }
  };
}

module.exports = {
  meta: {
    name: '@typescript-eslint/parser',
    version: '0.0.0-local'
  },
  parse,
  parseForESLint
};
