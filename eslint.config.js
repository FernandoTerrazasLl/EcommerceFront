import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict, 
  ...tseslint.configs.stylistic,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error', 
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], 
      
      'eqeqeq': ['error', 'always'], 
      'no-var': 'error', 
      'prefer-const': 'error', 
      
      'complexity': ['warn', 8], 
      'max-depth': ['warn', 3],
      'max-lines-per-function': ['warn', { max: 45, skipBlankLines: true, skipComments: true }], 
      
      'no-console': 'off',
    },
  }
);