import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

/**
 * ESLint 扁平配置（flat config）
 * ------------------------------------------------------------------
 * 分层：eslint:recommended 打底，再按运行环境分三块覆盖
 *   1. src/**            浏览器 + React/JSX
 *   2. public/sw.js      Service Worker（经典脚本，无 ESM）
 *   3. scripts / tests / 构建配置   Node（其中 *.cjs 为 CommonJS）
 * 只做静态检查，不参与构建；`npm run lint` 必须零错误零警告。
 */
export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      // 数据研究临时目录，不属于仓库产物
      '.nyc-research/**',
    ],
  },

  js.configs.recommended,

  /* ---------------------------- 浏览器端源码 ---------------------------- */
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // 项目使用 React 17+ 的自动 JSX 运行时，无需显式引入 React
      'react/react-in-jsx-scope': 'off',
      // 纯 JavaScript 项目，不使用 prop-types
      'react/prop-types': 'off',
      /*
       * 以下两条属于 React Compiler 时代的规则，本项目未启用 React Compiler，
       * 且现有实现是有意为之，规则在此会产生误报，故显式关闭：
       *  - set-state-in-effect：本项目的普遍模式是「依赖变化 → effect 重置派生 state」，
       *    例如筛选条件一变就让结果弹窗失效、转盘停转、matchMedia 首次同步。
       *    这是有意的派生状态重置，不是外部系统订阅写错。
       *  - refs：WheelPage 刻意用 ref 保存最新加权上下文，避免「就吃这个」之后
       *    转盘候选在用户眼前被悄悄换掉（见该文件内注释）。这是有意的读取时机控制。
       */
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
    },
  },

  /* --------------------------- Service Worker --------------------------- */
  {
    files: ['public/sw.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: { ...globals.browser, ...globals.serviceworker },
    },
  },

  /* ---------------------- Node 侧脚本 / 测试 / 配置 ---------------------- */
  {
    files: [
      'scripts/**/*.{js,cjs,mjs}',
      'tests/**/*.{js,cjs,mjs}',
      '*.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // 同时带上浏览器全局：e2e 用例里 page.evaluate() 的回调实际跑在浏览器中
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // .cjs 一律按 CommonJS 解析（require / module.exports / __dirname）
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
]
