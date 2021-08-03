module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  parserOptions: {
    ecmaVersion: 11,
  },
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
