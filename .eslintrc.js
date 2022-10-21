module.exports = {
    'env': {
      'browser': true,
      'es6': true,
      'node': true
    },
    'extends': [
      'eslint:recommended',
      'plugin:vue/essential'
    ],
    'globals': {
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
      'parser': 'babel-eslint',
      'ecmaVersion': 2018,
      'sourceType': 'module'
    },
    'plugins': [
      'vue'
    ],
    'rules': {
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'windows'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'never'
      ]
    }
  }