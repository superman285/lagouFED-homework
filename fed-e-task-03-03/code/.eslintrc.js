module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "space-before-function-paren": 0,
    "quotes": [1, "single"],//引号类型 `` "" ''
    "indent": 'off',
    "arrow-parens": 'off',
    "prefer-template": 'off',
    "no-multiple-empty-lines": [1, {"max": 10}],//空行最多不能超过2行
    "semi": [0]
  }
}
