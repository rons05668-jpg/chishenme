import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  /*
   * 只认 *.spec.js。
   * tests/unit/ 下是 Node 自带 node:test 的单元测试（*.test.cjs），
   * 若沿用 Playwright 默认的 testMatch（含 *.test.*），两者会互相误抓。
   */
  testMatch: '**/*.spec.js',
  workers: 1,
  timeout: 30000,
  /*
   * 关闭 Playwright 的 outputDir 自动清理。
   * 沙箱环境的批量删除保护会拦截对 test-results/ 的递归删除
   * （文件数超过阈值时判定为高危操作），导致测试启动即失败。
   * 这里改用固定输出目录并交由人工清理，避免与保护机制冲突。
   */
  outputDir: 'test-results/run',
  preserveOutput: 'always',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    ...devices['iPhone 13'],
    defaultBrowserType: 'chromium',
    channel: process.env.PW_CHANNEL || undefined,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
})
