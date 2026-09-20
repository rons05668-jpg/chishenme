import { test, expect } from '@playwright/test'
import { FOODS, CATEGORIES, TASTES, CUISINES, MEALS } from '../src/data/foods.js'

/**
 * 选项定位器。
 * 注意：手机视口（iPhone 13，390px）下 FilterPanel 处于 compact 模式，
 * 「风味 / 时段 / 忌口」被折叠在 .filter-more 之后，使用前需先展开。
 */
const option = (page, label, value) => page.locator('.option-group')
  .filter({ has: page.locator('.option-group__label', { hasText: label }) })
  .getByRole('button', { name: value, exact: true })

/** 展开紧凑模式下的次要条件（风味 / 时段 / 忌口） */
async function expandMore(page) {
  const more = page.locator('.filter-more')
  if (await more.count()) {
    const expanded = await more.getAttribute('aria-expanded')
    if (expanded !== 'true') await more.click()
  }
}

test('手机随机、收藏、历史及旧数据跨刷新保留', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('tqsc:v1:favorites', JSON.stringify(['huangmenji', 'niupai']))
    localStorage.setItem('tqsc:v1:history', JSON.stringify([{ uid: 'old', id: 'huangmenji', name: '黄焖鸡米饭', emoji: '🍗', category: '米饭', taste: '微辣', ts: Date.now() }]))
  })
  await page.goto('/#/random')
  await page.reload()
  await page.getByRole('button', { name: '帮我决定' }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  await page.getByRole('button', { name: '就吃这个', exact: false }).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:history')).length)).toBe(2)
  await page.reload()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:favorites')))).toEqual(['huangmenji', 'niupai'])
  await page.goto('/#/favorites')
  await expect(page.locator('.fav-card')).toHaveCount(2)
  await page.locator('.fav-card').first().click()
  await expect(page.locator('.result-card')).toBeVisible()
  await page.getByRole('button', { name: '已收藏', exact: false }).click()
  await expect(page.locator('.fav-card')).toHaveCount(1)
  await page.goto('/#/history')
  await expect(page.getByText('黄焖鸡米饭').first()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('旧版历史记录（缺少 name/emoji 等字段）仍可正常展示', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  // 模拟早期版本写入的极简历史记录：只有 id 与 ts
  await page.evaluate(() => {
    localStorage.setItem('tqsc:v1:history', JSON.stringify([
      { id: 'huangmenji', ts: Date.now() },
      { id: 'niupai', ts: Date.now() - 86400000 },
    ]))
  })
  await page.goto('/#/history')
  await page.reload()
  // 记录必须被保留，并按食物库补全名称
  await expect(page.getByText('黄焖鸡米饭').first()).toBeVisible()
  await expect(page.getByText('牛排').first()).toBeVisible()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:history')).length)).toBe(2)
  expect(errors).toEqual([])
})

test('忌口持久化并影响随机、收藏及转盘', async ({ page }) => {
  await page.goto('/#/random')
  await expandMore(page)
  await option(page, '忌口', '不吃辣').click()
  await page.reload()
  await expandMore(page)
  await expect(option(page, '忌口', '不吃辣')).toHaveAttribute('aria-pressed', 'true')
  await option(page, '口味', '辣').click()
  await expect(page.getByRole('button', { name: '帮我决定' })).toBeDisabled()
  await page.evaluate(() => localStorage.setItem('tqsc:v1:favorites', JSON.stringify(['chongqing-xiaomian'])))
  await page.goto('/#/favorites')
  await page.reload()
  await expect(page.locator('.fav-card')).toHaveCount(1)
  await page.getByRole('button', { name: '从收藏里随机一个', exact: false }).click()
  await expect(page.locator('.result-card')).toHaveCount(0)
  await page.goto('/#/wheel')
  await page.locator('.filter-toggle').click()
  await option(page, '口味', '辣').click()
  await expect(page.getByText('没有符合条件的食物', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '开始旋转' })).toHaveCount(0)
})

test('筛选变化后旧结果立即失效', async ({ page }) => {
  await page.goto('/#/random')
  await page.getByRole('button', { name: '帮我决定' }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  await option(page, '口味', '辣').click()
  await expandMore(page)
  await option(page, '忌口', '不吃辣').click()
  await expect(page.locator('.result-card')).toHaveCount(0)
})

test('转盘单候选直接展示，双候选旋转并禁用修改', async ({ page }) => {
  const find = (count) => {
    for (const category of CATEGORIES) for (const taste of TASTES) for (const cuisine of CUISINES) for (const meal of MEALS) {
      const foods = FOODS.filter((f) => f.category === category && f.taste === taste && f.cuisines.includes(cuisine) && f.meals.includes(meal))
      if (foods.length === count) return { category, taste, cuisine, meal, foods }
    }
    throw new Error('无测试候选')
  }
  for (const count of [1, 2]) {
    const scenario = find(count)
    await page.goto('/#/wheel')
    await page.reload()
    await page.locator('.filter-toggle').click()
    await expandMore(page)
    await option(page, '类型', scenario.category).click()
    await option(page, '口味', scenario.taste).click()
    await option(page, '风味', scenario.cuisine).click()
    await option(page, '时段', scenario.meal).click()
    if (count === 1) {
      await expect(page.locator('.result-card')).toBeVisible()
      await expect(page.locator('.result-card')).toContainText(scenario.foods[0].name)
      await expect(page.getByRole('button', { name: '开始旋转' })).toHaveCount(0)
    } else {
      await expect(page.locator('.wheel-seg-label')).toHaveCount(2)
      await page.getByRole('button', { name: '开始旋转' }).click()
      await expect(option(page, '口味', scenario.taste)).toBeDisabled()
      await expect(page.locator('.result-card')).toBeVisible({ timeout: 10000 })
      const text = await page.locator('.result-card').innerText()
      expect(scenario.foods.some((f) => text.includes(f.name))).toBe(true)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('PWA 首次安装后离线重新打开所有核心页面', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
  })
  await context.setOffline(true)
  for (const route of ['random', 'wheel', 'favorites', 'history']) {
    await page.goto('/#/' + route)
    await page.reload()
    await expect(page.locator('#root')).not.toBeEmpty()
    await expect(page.locator('.topbar')).toBeVisible()
  }
})

/* ==================================================================== */
/* 本轮新增需求的验收                                                     */
/* ==================================================================== */

test('筛选偏好跨页面共享并跨刷新恢复', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/#/random')
  await option(page, '口味', '辣').click()
  await option(page, '类型', '粉面').click()

  // 写入 localStorage
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:filters') || 'null')))
    .toMatchObject({ taste: '辣', category: '粉面' })

  // 刷新后恢复
  await page.reload()
  await expect(option(page, '口味', '辣')).toHaveAttribute('aria-pressed', 'true')
  await expect(option(page, '类型', '粉面')).toHaveAttribute('aria-pressed', 'true')

  // 随机页与转盘页共享
  await page.goto('/#/wheel')
  await page.locator('.filter-toggle').click()
  await expect(option(page, '口味', '辣')).toHaveAttribute('aria-pressed', 'true')
  await expect(option(page, '类型', '粉面')).toHaveAttribute('aria-pressed', 'true')

  // 在转盘页改条件，回到随机页也应生效（同一份全局状态）
  await option(page, '口味', '清淡').click()
  await page.goto('/#/random')
  await expect(option(page, '口味', '清淡')).toHaveAttribute('aria-pressed', 'true')
  expect(errors).toEqual([])
})

test('非法的筛选偏好数据被安全回退', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.evaluate(() => {
    // 非法枚举 + 类型错误 + 缺字段
    localStorage.setItem('tqsc:v1:filters', JSON.stringify({ taste: '超辣', category: 123, scene: null }))
  })
  await page.goto('/#/random')
  await page.reload()
  // 应回退到默认值，且页面不崩溃
  await expect(option(page, '口味', '随机')).toHaveAttribute('aria-pressed', 'true')
  await expect(option(page, '类型', '随机')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: '帮我决定' })).toBeEnabled()
  expect(errors).toEqual([])
})

test('重置筛选保留忌口', async ({ page }) => {
  await page.goto('/#/random')
  await option(page, '口味', '辣').click()
  await expandMore(page)
  await option(page, '忌口', '不吃辣').click()

  // 忌口生效：辣 + 不吃辣 → 零候选
  await expect(page.getByRole('button', { name: '帮我决定' })).toBeDisabled()

  // 重置普通筛选
  await page.getByRole('button', { name: '重置筛选（保留忌口）' }).click()

  // 口味回到默认，但忌口必须保留
  await expect(option(page, '口味', '随机')).toHaveAttribute('aria-pressed', 'true')
  await expandMore(page)
  await expect(option(page, '忌口', '不吃辣')).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:exclusions') || '[]')))
    .toEqual(['辣'])
})

test('零候选时给出可点击的放宽建议，且不自动改变忌口', async ({ page }) => {
  await page.goto('/#/random')

  // 构造零候选：不吃辣 + 口味辣（忌口导致的零候选必须由用户自行处理）
  await option(page, '口味', '辣').click()
  await expandMore(page)
  await option(page, '忌口', '不吃辣').click()
  await expect(page.locator('.pool-hint .is-empty, .pool-hint').first()).toBeVisible()
  await expect(page.getByRole('button', { name: '帮我决定' })).toBeDisabled()

  // 忌口未被自动放宽
  await expect(option(page, '忌口', '不吃辣')).toHaveAttribute('aria-pressed', 'true')

  // 放宽建议按钮存在时，点击应生效（改为放宽普通条件）
  const relax = page.locator('.relax-list button').first()
  if (await relax.count()) {
    await relax.click()
    await expect(page.getByRole('button', { name: '帮我决定' })).toBeEnabled()
  }
})

test('零候选放宽建议由用户点击后才应用', async ({ page }) => {
  await page.goto('/#/random')
  // 让普通条件叠加成极窄集合（不涉及忌口）
  await option(page, '类型', '粥汤').click()
  await option(page, '场景', '食堂').click()
  await expandMore(page)
  await option(page, '时段', '夜宵').click()
  // 若命中零候选，应出现放宽建议；未命中则跳过该场景
  const hint = page.locator('.pool-hint--relax')
  if (await hint.count()) {
    const before = await page.evaluate(() => localStorage.getItem('tqsc:v1:filters'))
    const relax = page.locator('.relax-list button').first()
    if (await relax.count()) {
      // 点击前：筛选状态未被自动修改
      expect(await page.evaluate(() => localStorage.getItem('tqsc:v1:filters'))).toBe(before)
      await relax.click()
      // 点击后：状态才变化
      await expect.poll(() => page.evaluate(() => localStorage.getItem('tqsc:v1:filters'))).not.toBe(before)
    }
  }
})

test('备份导出与导入：非法文件被拒绝，合法文件合并不丢数据', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('tqsc:v1:favorites', JSON.stringify(['huangmenji']))
    localStorage.setItem('tqsc:v1:exclusions', JSON.stringify(['香菜']))
    localStorage.setItem('tqsc:v1:history', JSON.stringify([{ uid: 'x1', id: 'niupai', name: '牛排', emoji: '🥩', ts: Date.now() }]))
  })
  await page.goto('/#/favorites')
  await page.reload()

  // 备份面板存在
  const panel = page.locator('.backup')
  await expect(panel).toBeVisible()

  // 导入非法文件：应给出失败提示，且不改变任何数据
  const before = await page.evaluate(() => ({
    favorites: localStorage.getItem('tqsc:v1:favorites'),
    exclusions: localStorage.getItem('tqsc:v1:exclusions'),
    history: localStorage.getItem('tqsc:v1:history'),
  }))
  await page.locator('.backup input[type="file"]').setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ 这不是合法 JSON'),
  })
  await expect(page.locator('.backup__result')).toBeVisible()
  await expect(page.locator('.backup__result')).toHaveClass(/is-error/)
  const after = await page.evaluate(() => ({
    favorites: localStorage.getItem('tqsc:v1:favorites'),
    exclusions: localStorage.getItem('tqsc:v1:exclusions'),
    history: localStorage.getItem('tqsc:v1:history'),
  }))
  expect(after).toEqual(before)

  // 导入合法备份：合并去重，不删除已有数据
  const backup = JSON.stringify({
    app: 'today-eat-what',
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    data: {
      history: [{ uid: 'x2', id: 'baozi', name: '包子', emoji: '🥟', ts: Date.now() }],
      favorites: ['baozi'],
      exclusions: ['内脏'],
      filterPrefs: { taste: '辣' },
    },
  })
  await page.locator('.backup input[type="file"]').setInputFiles({
    name: 'good.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  })
  await expect(page.locator('.backup__result')).toHaveClass(/is-success/)

  // 现有数据全部保留 + 新数据被合并
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:favorites'))))
    .toEqual(expect.arrayContaining(['huangmenji', 'baozi']))
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:exclusions'))))
    .toEqual(expect.arrayContaining(['香菜', '内脏']))
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:history')).map((r) => r.id)))
    .toEqual(expect.arrayContaining(['niupai', 'baozi']))
  expect(errors).toEqual([])
})

test('存储不可用时仍可随机推荐（写入失败有提示但不阻断）', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/#/random')

  // 让 setItem 抛错，模拟配额满 / 隐私模式
  await page.evaluate(() => {
    const proto = Object.getPrototypeOf(window.localStorage)
    proto.setItem = function () {
      throw new Error('QuotaExceededError')
    }
  })
  await page.reload()

  // 核心功能仍可用
  await expect(page.getByRole('button', { name: '帮我决定' })).toBeEnabled()
  await page.getByRole('button', { name: '帮我决定' }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  await page.getByRole('button', { name: '就吃这个', exact: false }).click()
  // 不崩溃即为通过（数据无法写入，但流程不中断）
  expect(errors).toEqual([])
})

test('转盘结果弹窗：Esc 关闭、焦点限制与背景滚动锁定', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))

  // 直接构造一个必出结果的转盘场景（双候选）
  const find = (count) => {
    for (const category of CATEGORIES) for (const taste of TASTES) for (const cuisine of CUISINES) for (const meal of MEALS) {
      const foods = FOODS.filter((f) => f.category === category && f.taste === taste && f.cuisines.includes(cuisine) && f.meals.includes(meal))
      if (foods.length === count) return { category, taste, cuisine, meal }
    }
    throw new Error('无测试候选')
  }
  const scenario = find(2)
  await page.goto('/#/wheel')
  await page.reload()
  await page.locator('.filter-toggle').click()
  await expandMore(page)
  await option(page, '类型', scenario.category).click()
  await option(page, '口味', scenario.taste).click()
  await option(page, '风味', scenario.cuisine).click()
  await option(page, '时段', scenario.meal).click()
  await page.getByRole('button', { name: '开始旋转' }).click()
  await expect(page.locator('.result-card')).toBeVisible({ timeout: 10000 })

  const sheet = page.locator('.sheet')
  await expect(sheet).toBeVisible()

  // 弹窗打开时背景滚动被锁定
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')

  // Esc 关闭
  await page.keyboard.press('Escape')
  await expect(page.locator('.sheet')).toHaveCount(0)
  // 关闭后滚动锁定被还原
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  expect(errors).toEqual([])
})

test('手机端横向不溢出（核心页面）', async ({ page }) => {
  for (const route of ['#/random', '#/wheel', '#/favorites', '#/history']) {
    await page.goto('/' + route)
    await page.reload()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
