module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript', // 等同于 extends 'prettier' + plugin 'prettier'
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {}, // 让 eslint-import-resolver-typescript 生效（如需）
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要显式 import React
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
   ignorePatterns: [ // 添加忽略规则
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.cjs',
    'config/',
  ],
   overrides: [
    {
      // 只对 src 目录下的文件应用 prettier 规则
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      extends: [
        'plugin:prettier/recommended'
      ],
      rules: {
        'prettier/prettier': [
          'warn',
          {
            endOfLine: 'auto',
          }
        ],
      }
    },
    {
      // 对非 src 目录的文件不应用 prettier
      files: ['*.js', '*.cjs', 'config/**/*'],
      rules: {
        'prettier/prettier': 'off'
      }
    }
  ],
};