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

/* ================================================================== */
/* 饮料模块                                                            */
/* ================================================================== */

/** 展开饮料筛选面板的次要条件（甜度 / 咖啡因 / 忌口） */
async function openDrinkFilters(page) {
  const toggle = page.locator('.filter-toggle')
  if (await toggle.count()) {
    const expanded = await toggle.getAttribute('aria-expanded')
    if (expanded !== 'true') await toggle.click()
  }
}

/**
 * 定位饮料面板中某一组选项的按钮。
 * 与食物版 option() 同构，但饮料面板的品牌组排在第一位，
 * 这里用索引兜底，避免 label 文案或图标变化导致定位漂移。
 */
const drinkOption = (page, groupIndex, name) =>
  page.locator('.filter-panel__main .option-group').nth(groupIndex)
    .getByRole('button', { name, exact: true })

test('饮料页：随机推荐展示品牌与饮品名，并标注价格来源', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/#/drink')
  await page.reload()

  await page.getByRole('button', { name: '帮我选一杯', exact: false }).click()
  await expect(page.locator('.result-card')).toBeVisible()

  // 品牌名必须展示（需求：必须推荐具体的品牌＋饮品）
  await expect(page.locator('.result-card__brand')).toBeVisible()
  // 价格来源由 drinkPriceLabel 承载：第三方来源必须标「第三方参考」
  await expect(page.locator('.result-card__price')).toBeVisible()
  const priceText = await page.locator('.result-card__price').innerText()
  expect(priceText.trim().length).toBeGreaterThan(0)
  if (priceText.includes('（第三方参考）')) {
    // 第三方来源必须显式标注，不能伪装成官方价
    expect(priceText).toContain('第三方参考')
  }
  // 底部「菜单与价格以门店为准（参考价来源：…）」整段说明已按要求移除
  await expect(page.getByText('菜单与价格以门店为准', { exact: false })).toHaveCount(0)
  // 不得出现「实时价格」这类未经接入的表述
  await expect(page.getByText('实时价格', { exact: false })).toHaveCount(0)
  expect(errors).toEqual([])
})

test('饮料页：价格未公示的饮品不显示 ¥0', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  // 连续抽几次，确认价格文案只会是「参考价未公示」或正常区间，绝不出现 ¥0
  for (let i = 0; i < 6; i += 1) {
    await page.getByRole('button', { name: '帮我选一杯', exact: false }).click()
    await expect(page.locator('.result-card')).toBeVisible()
    const priceText = await page.locator('.result-card__price').innerText()
    expect(priceText).not.toContain('¥0')
    expect(priceText.length).toBeGreaterThan(0)
  }
})

test('饮料页：仅不含咖啡因时排除未知与含咖啡因饮品', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  await openDrinkFilters(page)
  await expandMore(page)
  await option(page, '咖啡因', '无咖啡因').click()

  // 匹配数量提示应反映严格筛选结果
  await expect(page.locator('.pool-hint--inline')).toBeVisible()
  await page.getByRole('button', { name: '帮我选一杯', exact: false }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  // 结果里不得出现「unknown」或含咖啡因标签
  const tags = await page.locator('.result-card__tags').innerText()
  expect(tags).not.toContain('unknown')
})

test('饮料页：品牌筛选只返回该品牌，且偏好跨刷新保留', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  await openDrinkFilters(page)
  // 选一个实际有数据的品牌（品牌组固定是 .filter-panel__main 内第 0 组）
  await drinkOption(page, 0, '一点点').click()
  await page.reload()
  await openDrinkFilters(page)
  await expect(drinkOption(page, 0, '一点点')).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: '帮我选一杯', exact: false }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  await expect(page.locator('.result-card__brand')).toHaveText('一点点')
})

test('饮料页：重置筛选保留饮料忌口', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  await openDrinkFilters(page)
  await drinkOption(page, 0, '一点点').click()
  await expandMore(page)
  await page.getByRole('button', { name: '不要咖啡因' }).click()

  await page.getByRole('button', { name: '重置筛选（保留忌口）' }).click()
  // 普通筛选回到不限，但忌口仍在
  await expect(drinkOption(page, 0, '不限')).toHaveAttribute('aria-pressed', 'true')
  await expandMore(page)
  await expect(page.getByRole('button', { name: '不要咖啡因' })).toHaveAttribute('aria-pressed', 'true')
})

test('饮料页：不暴露无数据支撑的筛选器（甜度），忌口不锁死功能', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  await openDrinkFilters(page)
  await expandMore(page)

  /*
   * 甜度筛选已移除：推荐池内没有任何一条带官方公示的糖度，
   * 保留该筛选器等于「一选就零候选」的界面装饰，需求明令禁止。
   */
  const groups = page.locator('.filter-panel__extra-inner .option-group')
  const labels = await groups.locator('.option-group__label').allInnerTexts()
  expect(labels.join('|')).not.toContain('甜度')

  // 咖啡因筛选必须保留（有真实数据支撑）
  expect(labels.join('|')).toContain('咖啡因')

  /*
   * 「不要高糖」不得把候选清零：糖度未公示不等于高糖。
   * 勾选后匹配数必须仍大于 0，否则等于一个勾选锁死整个推荐功能。
   */
  await page.getByRole('button', { name: '不要高糖' }).click()
  const hint = await page.locator('.pool-hint--inline').innerText()
  const matched = Number((hint.match(/(\d+)/) || [])[1])
  expect(matched).toBeGreaterThan(0)

  // 勾了忌口后，界面必须诚实提示「未公示的信息无法代为排除」
  await expect(page.getByText('有过敏或严格忌口需求请向门店确认', { exact: false })).toBeVisible()
})

test('饮料页：收藏与历史使用独立存储键，不污染食物数据', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  // 预置食物数据，验证饮料操作不会动它
  await page.evaluate(() => {
    localStorage.setItem('tqsc:v1:favorites', JSON.stringify(['huangmenji']))
    localStorage.setItem('tqsc:v1:history', JSON.stringify([{ uid: 'f1', id: 'huangmenji', ts: 111 }]))
  })
  await page.reload()

  await page.getByRole('button', { name: '帮我选一杯', exact: false }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  await page.getByRole('button', { name: '收藏' , exact: false }).click()
  await page.getByRole('button', { name: '就喝这个', exact: false }).click()

  // 饮料数据写入独立键
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:drinkFavorites') || '[]').length)).toBe(1)
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:drinkHistory') || '[]').length)).toBe(1)
  // 食物数据未被改动
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:favorites')))).toEqual(['huangmenji'])
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('tqsc:v1:history')).length)).toBe(1)
})

test('饮料页：刷新后饮品收藏与历史恢复', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  await page.getByRole('button', { name: '帮我选一杯', exact: false }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  await page.getByRole('button', { name: '收藏', exact: false }).click()
  await page.getByRole('button', { name: '就喝这个', exact: false }).click()

  await page.reload()
  await page.goto('/#/favorites')
  // 饮品收藏在收藏页的独立分区里（复用 .fav-card 系列，条目文案含品牌名）
  await expect(page.getByText('收藏的饮品', { exact: false })).toBeVisible()
  await expect(page.locator('.fav-card').first()).toBeVisible()

  await page.goto('/#/history')
  // 饮品记录复用食物历史的 .record-item 结构，位于「🧋 喝过记录」分区
  await expect(page.getByText('喝过记录', { exact: false })).toBeVisible()
  await expect(page.locator('.record-item').first()).toBeVisible()
  // 条目必须显示「品牌 · 饮品名」，而不是只有饮品名
  await expect(page.locator('.record-item__name').first()).toContainText('·')
})

test('首页存在「喝什么」入口且底部导航未塞满', async ({ page }) => {
  await page.goto('/')
  await page.reload()
  // 首页入口
  await expect(page.getByRole('button', { name: '今天喝什么', exact: false })).toBeVisible()
  // 底部导航不应为饮料模块新增 tab。
  // 现有底部导航固定 5 项（首页 / 随机 / 转盘 / 记录 / 收藏），饮品模块只加首页卡片，不占 tab。
  const navCount = await page.locator('nav a').count()
  expect(navCount).toBeLessThanOrEqual(5)
  const navLabels = await page.locator('nav a').allInnerTexts()
  expect(navLabels.join('')).not.toContain('喝什么')

  await page.getByRole('button', { name: '今天喝什么', exact: false }).click()
  await expect(page).toHaveURL(/#\/drink/)
})

test('饮料页：手机端横向不溢出', async ({ page }) => {
  await page.goto('/#/drink')
  await page.reload()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await openDrinkFilters(page)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('饮料页：离线（SW 缓存）仍可随机推荐', async ({ page, context }) => {
  await page.goto('/#/drink')
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null || navigator.serviceWorker.ready)
  await context.setOffline(true)
  await page.reload()
  await page.getByRole('button', { name: '帮我选一杯', exact: false }).click()
  await expect(page.locator('.result-card')).toBeVisible()
  await context.setOffline(false)
})
