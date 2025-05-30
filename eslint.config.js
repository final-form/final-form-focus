import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        document: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['src/**/*.test.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',
        setTimeout: 'readonly',
        global: 'readonly',
        document: 'readonly'
        // add more Jest/browser globals if needed
      }
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'eslint.config.js',
      'jest.config.js',
      'package-scripts.js',
      'rollup.config.js'
    ]
  }
]
