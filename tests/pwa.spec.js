import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * PWA 专项用例（只在 webkit 工程跑，见 playwright.config.js）。
 * ------------------------------------------------------------------
 * 背景：README 明确主目标是 iPhone 主屏（添加到主屏幕的 PWA），
 * 但 CI 原来只跑 chromium。Safari 的 SW 安装 / 离线 / 更新提示
 * 在这里覆盖。
 *
 * 注意：Playwright 的 webkit 对 Service Worker 的支持是尽力而为，
 * 若当前版本不支持，相关用例会主动 skip 而不是失败。
 */

const SW_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sw.js')
const swSource = () => readFileSync(SW_PATH, 'utf8')

test.describe('PWA（webkit）', () => {
  test('manifest 可获取：含 id / shortcuts，图标齐全', async ({ page }) => {
    const response = await page.request.get('/manifest.webmanifest')
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('manifest')

    const manifest = await response.json()
    expect(manifest.id).toBe('/')
    expect(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length).toBeGreaterThan(0)
    for (const icon of manifest.icons) {
      const res = await page.request.get(icon.src)
      expect(res.ok(), `图标 ${icon.src} 不可访问`).toBe(true)
    }
    expect((await page.request.get('/icons/apple-touch-icon.png')).ok()).toBe(true)
  })

  test('SW 更新全流程：waiting → 用户确认 → 接管 → 离线仍可打开', async ({
    page,
    context,
  }) => {
    await page.goto('/')
    const swSupported = await page.evaluate(() => 'serviceWorker' in navigator)
    test.skip(!swSupported, '当前 webkit 不支持 Service Worker，跳过')

    const hasWaiting = () =>
      page.evaluate(() =>
        navigator.serviceWorker.getRegistration().then((reg) => Boolean(reg && reg.waiting))
      )

    // 1. 首个 SW 安装后进入 waiting（不自动接管，符合 sw.js 的设计）
    await expect.poll(hasWaiting, { timeout: 20000 }).toBe(true)

    // 2. 模拟用户点「立即刷新」：让 waiting 的 SW 接管页面
    await page.evaluate(() =>
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => reg.waiting.postMessage({ type: 'SKIP_WAITING' }))
    )
    await expect
      .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), {
        timeout: 20000,
      })
      .toBe(true)

    // 3. 伪造一个「新版本」SW（BUILD_ID 不同即 CACHE 名不同，浏览器视为新版本），触发 update
    let buildId = 'test-build-v99'
    await page.route('**/sw.js', (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: swSource().replaceAll('__BUILD_ID__', buildId),
      })
    )
    await page.evaluate(() => navigator.serviceWorker.getRegistration().then((reg) => reg.update()))

    // 4. 更新提示条出现
    const banner = page.locator('.update-banner')
    await expect(banner).toBeVisible({ timeout: 20000 })

    // 5. 点「稍后」：横幅消失；同一版本刷新后不再打扰
    await banner.getByRole('button', { name: '稍后' }).click()
    await expect(banner).toBeHidden()
    await page.reload()
    await expect(page.locator('.topbar')).toBeVisible()
    await expect(banner).toBeHidden()

    // 6. 又来一个新版本：横幅重新出现（新版本不受旧「稍后」影响）
    buildId = 'test-build-v100'
    await page.evaluate(() => navigator.serviceWorker.getRegistration().then((reg) => reg.update()))
    await expect(banner).toBeVisible({ timeout: 20000 })

    // 7. 点「立即刷新」：用户确认后页面重载
    await Promise.all([
      page.waitForNavigation(),
      banner.getByRole('button', { name: '立即刷新' }).click(),
    ])
    await expect(page.locator('.topbar')).toBeVisible()

    // 8. 离线：导航请求回退到 SW 预缓存的首页
    await context.setOffline(true)
    await page.reload()
    await expect(page.locator('#root')).not.toBeEmpty()
    await expect(page.locator('.topbar')).toBeVisible()
  })
})
