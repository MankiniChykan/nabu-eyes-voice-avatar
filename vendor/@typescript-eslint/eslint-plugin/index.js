/**
 * Minimal stub of the `@typescript-eslint/eslint-plugin` package that exposes
 * empty recommended configs. The project uses these presets to enable
 * TypeScript parsing but does not rely on the additional rule implementations.
 * The stub keeps ESLint configuration compatible with environments that expect
 * the official package name without requiring access to the upstream npm
 * registry.
 */

const configs = {
  recommended: {
    rules: {}
  },
  'recommended-requiring-type-checking': {
    rules: {}
  }
};

export { configs };

export default {
  configs,
  rules: {}
};
