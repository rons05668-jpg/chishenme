import { test, expect } from '@playwright/test'
import { FOODS, CATEGORIES, TASTES, CUISINES, MEALS } from '../src/data/foods.js'

const option = (page, label, value) => page.locator('.option-group')
  .filter({ has: page.locator('.option-group__label', { hasText: label }) })
  .getByRole('button', { name: value, exact: true })

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
  await expect(page.getByText('249', { exact: true })).toBeVisible()
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

test('忌口持久化并影响随机、收藏及转盘', async ({ page }) => {
  await page.goto('/#/random')
  await option(page, '忌口', '不吃辣').click()
  await page.reload()
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
    await option(page, '类型', scenario.category).click()
    await option(page, '口味', scenario.taste).click()
    await page.getByText('风味与用餐时段', { exact: true }).click()
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
