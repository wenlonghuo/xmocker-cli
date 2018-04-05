module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/essential",
    "@vue/standard"
  ],
  'rules': {
    "comma-dangle": [0, "always-multiline"],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-new-func': 0,
    "no-template-curly-in-string": 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  "globals": {
    "WebSocket": true
  }
}