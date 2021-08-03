module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'no-console': 'off',
    indent: 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
      },
    ],
  },
};
