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
       * react-hooks/set-state-in-effect 与 react-hooks/refs 曾在全仓关闭，
       * 现改为按文件豁免（见下方 overrides）：新代码的误用会被 lint 拦下，
       * 只有注释里写明「有意为之」的现有三处（派生状态重置 / ref 时机控制）
       * 保留豁免。
       */
    },
  },

  /*
   * 有意的派生状态重置（筛选条件一变就让结果弹窗失效 / 候选变化就重置转盘 /
   * matchMedia 首次同步），不是外部系统订阅写错，故局部豁免 set-state-in-effect。
   */
  {
    files: ['src/pages/WheelPage.jsx', 'src/components/Wheel.jsx', 'src/hooks/useMediaQuery.js'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },

  /*
   * 有意的 ref 读取时机控制（转盘候选 / 抽取上下文 / 持久化状态镜像），
   * 不是误用，故局部豁免 refs。
   */
  {
    files: [
      'src/hooks/useDecider.js',
      'src/components/Wheel.jsx',
      'src/pages/WheelPage.jsx',
      'src/pages/DrinkPage.jsx',
      'src/state/AppState.jsx',
    ],
    rules: { 'react-hooks/refs': 'off' },
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
