module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // 缩进规则
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'vue/script-indent': ['error', 2, { 'baseIndent': 1 }],

    // 错误级别规则 - 必须修复
    'prettier/prettier': 'error',
    'vue/no-mutating-props': 'error',
    'vue/no-unused-components': 'error',
    'vue/no-unused-vars': 'error',
    'vue/require-v-for-key': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-console': 'error',
    'no-debugger': 'error',

    // 警告级别规则 - 建议修复
    'vue/multi-word-component-names': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // 关闭的规则
    'vue/no-setup-props-destructure': 'off'
  }
};