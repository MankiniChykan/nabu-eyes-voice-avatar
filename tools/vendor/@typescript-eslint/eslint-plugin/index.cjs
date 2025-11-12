function createBaseConfig() {
  return {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {}
  };
}

const configs = {
  recommended: createBaseConfig(),
  'recommended-requiring-type-checking': {
    ...createBaseConfig(),
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json',
      tsconfigRootDir: process.cwd()
    }
  }
};

module.exports = {
  meta: {
    name: '@typescript-eslint/eslint-plugin',
    version: '0.0.0-local'
  },
  configs,
  rules: {}
};
