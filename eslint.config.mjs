import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import tailwind from 'eslint-plugin-tailwindcss';
import globals from 'globals';

export default [
  // --- 1. Base Configurations (Flattened Arrays) ---
  // The correct method is to spread the imported arrays into the top-level array.
  ...js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  
  // --- 2. Project-Specific Configuration (React, Prettier, Custom Rules) ---
  {
    files: ['**/*.ts', '**/*.tsx'],
    
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        globals: {
            ...globals.browser,
            ...globals.node,
        }
      },
    },
    
    // --- Plugins ---
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
      tailwindcss: tailwind, 
    },
    
    // --- Rules (Enforcing Pristine and Stability Mandates) ---
    rules: {
      // General Code Quality
      'prettier/prettier': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'curly': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      // React Rules
      'react/jsx-uses-react': 'off', 
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error', 
      'react-hooks/exhaustive-deps': 'warn', 

      // TypeScript Rules (Mandatory Safety Checks)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off', 
      '@typescript-eslint/no-explicit-any': 'warn', 
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }], 
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      
      // Tailwind Rules (Aesthetic Consistency)
      'tailwindcss/no-custom-classname': 'warn', 
      'tailwindcss/classnames-order': 'warn',
    },
    
    // 4. Settings
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // 5. Ignore specific files/directories
  {
      ignores: ['dist/**', 'node_modules/**', '*.js', 'tests/e2e/**'],
  }
];
