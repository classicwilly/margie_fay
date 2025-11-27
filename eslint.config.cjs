const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat(require('eslint/conf/eslint-recommended'));

module.exports = [
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require.resolve('@typescript-eslint/parser'),
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: { jsx: true }
    },
    rules: {
      'no-console': ['warn'],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': ['error', {
        patterns: ['contexts/*','components/*']
      }]
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: {} }
    }
  }
];
