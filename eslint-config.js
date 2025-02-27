import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['dist', 'node_modules'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
];
