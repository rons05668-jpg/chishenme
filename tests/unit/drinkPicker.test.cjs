#!/usr/bin/env node
/**
 * drinkPicker.js 单元测试
 * ------------------------------------------------------------------
 * 运行：node --test tests/unit/
 * 零第三方依赖，使用 Node 22 自带的 node:test + node:assert。
 * 与 picker.test.cjs 同样的 module.registerHooks 方案：
 * 仅在内存中把无扩展名的相对导入补成 '.js'，不修改任何 src 源码。
 */

'use strict'

const path = require('node:path')
const Module = require('node:module')
const { pathToFileURL } = require('node:url')
const { test, before } = require('node:test')
const assert = require('node:assert/strict')

Module.registerHooks({
  resolve(specifier, context, nextResolve) {
    const isRelative = specifier.startsWith('./') || specifier.startsWith('../')
    if (isRelative && !path.extname(specifier)) {
      return nextResolve(`${specifier}.js`, context)
    }
    return nextResolve(specifier, context)
  },
})

const ROOT = path.join(__dirname, '..', '..')
const SRC = path.join(ROOT, 'src')
const load = (relative) => import(pathToFileURL(path.join(SRC, relative)).href)

const DAY_MS = 24 * 60 * 60 * 1000

let DRINKS
let filterDrinks
let respectsDrinkExclusions
let isRecommendable
let weightOfDrink
let pickDrink
let pickDrinkByBrand
let sampleDrinks
let sampleDrinksByBrand
let daysSinceLastEaten

before(async () => {
  const drinksMod = await load('data/drinks.js')
  const pickerMod = await load('lib/drinkPicker.js')
  const basePickerMod = await load('lib/picker.js')

  DRINKS = drinksMod.DRINKS
  filterDrinks = pickerMod.filterDrinks
  respectsDrinkExclusions = pickerMod.respectsDrinkExclusions
  isRecommendable = pickerMod.isRecommendable
  weightOfDrink = pickerMod.weightOfDrink
  pickDrink = pickerMod.pickDrink
  pickDrinkByBrand = pickerMod.pickDrinkByBrand
  sampleDrinks = pickerMod.sampleDrinks
  sampleDrinksByBrand = pickerMod.sampleDrinksByBrand
  daysSinceLastEaten = basePickerMod.daysSinceLastEaten
})

const eatenDaysAgo = (id, days) => [{ id, ts: Date.now() - days * DAY_MS }]

const approx = (actual, expected, message) => {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    message || `期望约 ${expected}，实际 ${actual}`
  )
}

/** 按 brandId 分组，返回 [brandId, drinks[]] 按组大小降序 */
const groupByBrand = (pool) => {
  const groups = new Map()
  for (const drink of pool) {
    const key = drink.brandId || '__unknown__'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(drink)
  }
  return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length)
}

/* ================================================================== */
/* daysSinceLastEaten —— 不依赖 history 数组顺序                          */
/* ================================================================== */

test('daysSinceLastEaten 不依赖数组顺序：乱序/正序都取最大 ts', () => {
  const drink = DRINKS[0]
  const now = Date.now()
  const ascending = [
    { id: drink.id, ts: now - 5 * DAY_MS },
    { id: drink.id, ts: now - 1 * DAY_MS },
  ]
  const descending = [...ascending].reverse()
  assert.equal(daysSinceLastEaten(drink.id, ascending), 1)
  assert.equal(daysSinceLastEaten(drink.id, descending), 1)
  // 混入其他 id 的记录不影响
  const mixed = [{ id: 'other', ts: now }, ...ascending]
  assert.equal(daysSinceLastEaten(drink.id, mixed), 1)
})

/* ================================================================== */
/* filterDrinks / respectsDrinkExclusions / isRecommendable             */
/* ================================================================== */

test('filterDrinks 空条件返回全部可推荐饮品', () => {
  const pool = filterDrinks({})
  assert.ok(pool.length > 0)
  assert.ok(pool.every(isRecommendable))
  assert.equal(pool.length, DRINKS.filter(isRecommendable).length)
})

test('filterDrinks 品牌筛选只保留该品牌', () => {
  const groups = groupByBrand(filterDrinks({}))
  const [brandId] = groups[0]
  const pool = filterDrinks({ brand: brandId })
  assert.ok(pool.length > 0)
  assert.ok(pool.every((drink) => drink.brandId === brandId))
})

test('respectsDrinkExclusions：咖啡因忌口排除含咖啡因饮品', () => {
  const withCaffeine = DRINKS.find((d) => d.caffeine !== '无咖啡因' && isRecommendable(d))
  const withoutCaffeine = DRINKS.find((d) => d.caffeine === '无咖啡因' && isRecommendable(d))
  assert.ok(withCaffeine, '需要一条含咖啡因的可推荐饮品做用例')
  assert.ok(withoutCaffeine, '需要一条无咖啡因的可推荐饮品做用例')
  assert.equal(respectsDrinkExclusions(withCaffeine, ['咖啡因']), false)
  assert.equal(respectsDrinkExclusions(withoutCaffeine, ['咖啡因']), true)
  // 未知忌口标签不误杀
  assert.equal(respectsDrinkExclusions(withCaffeine, ['不存在的标签']), true)
})

test('isRecommendable：只有 permanent 进推荐池', () => {
  const nonPermanent = DRINKS.find((d) => d.availability !== 'permanent')
  assert.ok(nonPermanent, '需要一条非 permanent 的饮品做用例')
  assert.equal(isRecommendable(nonPermanent), false)
  assert.equal(filterDrinks({}).every((d) => d.id !== nonPermanent.id), true)
})

test('respectsDrinkExclusions 缺字段的脏数据不抛错（防御性守卫）', () => {
  const dirty = { id: 'dirty-1', brandId: 'x' }
  assert.doesNotThrow(() =>
    respectsDrinkExclusions(dirty, ['咖啡因', '乳制品', '冰', '高糖'])
  )
  // 缺字段时按「不命中」处理，不静默排除
  assert.equal(respectsDrinkExclusions(dirty, []), true)
  assert.equal(respectsDrinkExclusions(dirty, ['高糖']), true)
})

/* ================================================================== */
/* weightOfDrink —— 时间衰减 / 不喜欢 / 收藏                              */
/* ================================================================== */

test('weightOfDrink 时间衰减与食物侧一致', () => {
  const drink = DRINKS[0]
  assert.equal(weightOfDrink(drink, { history: eatenDaysAgo(drink.id, 0) }), 6)
  assert.equal(weightOfDrink(drink, { history: eatenDaysAgo(drink.id, 1) }), 18)
  approx(weightOfDrink(drink, {}), 115)
  approx(weightOfDrink(drink, { dislikes: [drink.id] }), 11.5)
  approx(weightOfDrink(drink, { favorites: [drink.id] }), 143.75)
})

/* ================================================================== */
/* pickDrinkByBrand —— 品牌优先的两段式抽样                               */
/* ================================================================== */

test('pickDrinkByBrand：大目录品牌不因条目多而系统性占优', () => {
  const groups = groupByBrand(filterDrinks({}))
  assert.ok(groups.length >= 2, '需要至少两个品牌做公平性用例')
  assert.ok(groups[0][1].length > groups[1][1].length, '需要条目数有差异的两个品牌')
  const pool = [...groups[0][1], ...groups[1][1]]

  const counts = new Map()
  const N = 2000
  for (let i = 0; i < N; i += 1) {
    const picked = pickDrinkByBrand(pool, {})
    counts.set(picked.brandId, (counts.get(picked.brandId) || 0) + 1)
  }
  // 品牌等概率：每个品牌期望 50%，用宽松区间 [35%, 65%] 避免 flaky
  for (const [brandId] of groups.slice(0, 2)) {
    const ratio = (counts.get(brandId) || 0) / N
    assert.ok(
      ratio > 0.35 && ratio < 0.65,
      `品牌 ${brandId} 占比 ${ratio.toFixed(3)}，偏离等概率太远`
    )
  }
})

test('pickDrinkByBrand 单品牌时退化为品牌内加权随机', () => {
  const groups = groupByBrand(filterDrinks({}))
  const pool = groups[0][1]
  const ids = new Set(pool.map((d) => d.id))
  for (let i = 0; i < 100; i += 1) {
    assert.ok(ids.has(pickDrinkByBrand(pool, {}).id))
  }
  assert.equal(pickDrink([], {}), null)
  assert.equal(pickDrinkByBrand([], {}), null)
})

/* ================================================================== */
/* sampleDrinks / sampleDrinksByBrand —— 不放回抽样                       */
/* ================================================================== */

test('sampleDrinks 不放回：无重复且数量正确', () => {
  const pool = filterDrinks({})
  const picked = sampleDrinks(pool, 8)
  assert.equal(picked.length, 8)
  assert.equal(new Set(picked.map((d) => d.id)).size, 8)
  assert.deepEqual(sampleDrinks([], 5), [])
})

test('sampleDrinksByBrand 不放回：无重复、数量正确、品牌分层', () => {
  const groups = groupByBrand(filterDrinks({})).slice(0, 3)
  const pool = groups.flatMap(([, list]) => list)
  assert.ok(pool.length >= 12, '用例需要至少 12 条候选')

  const picked = sampleDrinksByBrand(pool, 6, {})
  assert.equal(picked.length, 6)
  assert.equal(new Set(picked.map((d) => d.id)).size, 6)
  // 轮转取样：6 个名额分给 3 个品牌，每个品牌至少拿到 1 个
  const brandIds = new Set(picked.map((d) => d.brandId))
  assert.equal(brandIds.size, 3)
})

test('sampleDrinksByBrand 是真随机而非确定性贪心', () => {
  const pool = filterDrinks({})
  assert.ok(pool.length >= 20, '用例需要至少 20 条候选')
  // 相同筛选 + 相同上下文跑 30 次：确定性贪心每次组合完全相同，
  // 真加权抽样应出现多种组合
  const seen = new Set()
  for (let i = 0; i < 30; i += 1) {
    const picked = sampleDrinksByBrand(pool, 6, {})
    seen.add(picked.map((d) => d.id).sort().join(','))
  }
  assert.ok(seen.size > 1, '30 次抽样组合完全相同，疑似退化为确定性选取')
})

test('sampleDrinksByBrand 候选不足时返回全部', () => {
  const pool = filterDrinks({}).slice(0, 4)
  const picked = sampleDrinksByBrand(pool, 10, {})
  assert.equal(picked.length, 4)
  assert.equal(new Set(picked.map((d) => d.id)).size, 4)
})
