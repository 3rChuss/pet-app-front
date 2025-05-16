/* eslint-env node */
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const importPlugin = require('eslint-plugin-import')

module.exports = defineConfig([
  expoConfig,
  importPlugin.flatConfigs.recommended, // Add the import plugin configuration
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'react/display-name': 'off',
      'import/order': [
        // Add the import/order rule
        'warn', // or 'error' to fail on unsorted imports
        {
          groups: [
            'builtin', // Built-in Node.js modules
            'external', // External packages
            'internal', // Internal modules (aliased paths)
            'parent', // Parent directory imports
            'sibling', // Sibling directory imports
            'index', // Index file imports
            'object', // Object imports (e.g., import { type Foo } from 'bar')
            'type', // Type imports
          ],
          pathGroups: [
            {
              pattern: 'react', // Treat react as a separate group at the top
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**', // For internal aliased paths like @/components/*
              group: 'internal',
            },
            {
              pattern: '@/lib/**',
              group: 'internal',
            },
            {
              pattern: '@/hooks/**',
              group: 'internal',
            },
            {
              pattern: '@/providers/**',
              group: 'internal',
            },
            {
              pattern: '@/theme/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'type'],
          'newlines-between': 'always', // Add a newline between import groups
          alphabetize: {
            order: 'asc', // Sort in ascending order
            caseInsensitive: true, // Ignore case when sorting
          },
        },
      ],
    },
  },
])
