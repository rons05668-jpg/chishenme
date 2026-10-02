#!/usr/bin/env node
/**
 * picker.js / filters.js 单元测试
 * ------------------------------------------------------------------
 * 运行：node --test tests/unit/
 * 零第三方依赖，使用 Node 22 自带的 node:test + node:assert。
 *
 * 与 scripts/check-data.cjs 同样的前置条件：src 下的源码是 ESM，且使用了
 * Vite 风格的「无扩展名相对导入」（如 from '../data/foods'）。原生 Node ESM
 * 不做扩展名补全，因此这里复用同一套 module.registerHooks 方案，仅在内存中
 * 把无扩展名的相对路径补成 '.js'，不修改任何 src 源码。
 *
 * 之所以写成 .cjs 而不是 .mjs：registerHooks 需要在任何 import 之前同步注册，
 * 用 require('node:module') 最直接；模块本身则在 before 钩子里动态 import。
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

let FOODS
let filterFoods
let weightOf
let daysSinceLastEaten
let pickFood
let sampleFoods
let shuffle
let buildWheelPool
let DEFAULT_FILTERS
let toPickerFilters
let REGIONS

before(async () => {
  const foodsMod = await load('data/foods.js')
  const pickerMod = await load('lib/picker.js')
  const filtersMod = await load('lib/filters.js')

  FOODS = foodsMod.FOODS
  REGIONS = foodsMod.REGIONS
  filterFoods = pickerMod.filterFoods
  weightOf = pickerMod.weightOf
  daysSinceLastEaten = pickerMod.daysSinceLastEaten
  pickFood = pickerMod.pickFood
  sampleFoods = pickerMod.sampleFoods
  shuffle = pickerMod.shuffle
  buildWheelPool = pickerMod.buildWheelPool
  DEFAULT_FILTERS = filtersMod.DEFAULT_FILTERS
  toPickerFilters = filtersMod.toPickerFilters
})

/** 构造「N 天前吃过」的 history，让 daysSinceLastEaten 精确落在 N */
const eatenDaysAgo = (id, days) => [{ id, ts: Date.now() - days * DAY_MS }]

/**
 * 浮点容差断言。
 * weightOf 内部是连乘（100 × 1.15 × 0.1 …），100 × 1.15 在 IEEE 754 下
 * 得到 114.99999999999999，用严格相等会误报，这里统一按 1e-9 容差比较。
 */
const approx = (actual, expected, message) => {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    message || `期望约 ${expected}，实际 ${actual}`,
  )
}

/* ================================================================== */
/* weightOf —— 时间衰减                                                 */
/* ================================================================== */

test('weightOf 时间衰减：0/1/2 天分别降到 0.06 / 0.18 / 0.4', () => {
  const food = FOODS[0]
  assert.equal(weightOf(food, { history: eatenDaysAgo(food.id, 0) }), 6)
  assert.equal(weightOf(food, { history: eatenDaysAgo(food.id, 1) }), 18)
  assert.equal(weightOf(food, { history: eatenDaysAgo(food.id, 2) }), 40)
})

test('weightOf 时间衰减：3–6 天统一 0.75', () => {
  const food = FOODS[0]
  for (const days of [3, 4, 5, 6]) {
    assert.equal(
      weightOf(food, { history: eatenDaysAgo(food.id, days) }),
      75,
      `${days} 天前吃过应为 75`,
    )
  }
})

test('weightOf 时间衰减：7–14 天无衰减（基准 100）', () => {
  const food = FOODS[0]
  for (const days of [7, 10, 14]) {
    assert.equal(
      weightOf(food, { history: eatenDaysAgo(food.id, days) }),
      100,
      `${days} 天前吃过应为 100`,
    )
  }
})

test('weightOf 时间衰减：超过 14 天与从未吃过均为 1.15 新鲜感加权', () => {
  const food = FOODS[0]
  approx(weightOf(food, { history: eatenDaysAgo(food.id, 15) }), 115)
  approx(weightOf(food, { history: eatenDaysAgo(food.id, 60) }), 115)
  approx(weightOf(food, {}), 115)
  approx(weightOf(food), 115)
})

test('daysSinceLastEaten 边界：空 history 为 Infinity，命中为天数差', () => {
  const food = FOODS[0]
  assert.equal(daysSinceLastEaten(food.id, []), Infinity)
  assert.equal(daysSinceLastEaten(food.id, eatenDaysAgo(food.id, 0)), 0)
  assert.equal(daysSinceLastEaten(food.id, eatenDaysAgo(food.id, 3)), 3)
  assert.equal(daysSinceLastEaten(food.id, [{ id: FOODS[1].id, ts: Date.now() }]), Infinity)
})

/* ================================================================== */
/* weightOf —— 不喜欢 / 收藏系数                                        */
/* ================================================================== */

test('weightOf 命中「这个不要」时 ×0.1', () => {
  const food = FOODS[0]
  // 从未吃过 → 基准 115，再乘 0.1
  approx(weightOf(food, { dislikes: [food.id] }), 11.5)
  // 与时间衰减叠加：今天吃过 100 × 0.06 × 0.1 = 0.6
  approx(weightOf(food, { history: eatenDaysAgo(food.id, 0), dislikes: [food.id] }), 0.6)
  // 只有别的 id 命中时不生效
  approx(weightOf(food, { dislikes: [FOODS[1].id] }), 115)
})

test('weightOf 命中收藏时 ×1.25', () => {
  const food = FOODS[0]
  approx(weightOf(food, { favorites: [food.id] }), 143.75)
  approx(weightOf(food, { history: eatenDaysAgo(food.id, 0), favorites: [food.id] }), 7.5)
  approx(weightOf(food, { favorites: [FOODS[1].id] }), 115)
})

test('weightOf 不喜欢与收藏同时命中时两个系数相乘', () => {
  const food = FOODS[0]
  // 115 × 0.1 × 1.25 = 14.375
  approx(weightOf(food, { dislikes: [food.id], favorites: [food.id] }), 14.375)
})

/* ================================================================== */
/* pickFood / sampleFoods / shuffle                                     */
/* ================================================================== */

test('pickFood 空池返回 null', () => {
  assert.equal(pickFood([]), null)
  assert.equal(pickFood([], {}), null)
  assert.equal(pickFood([], { history: [], dislikes: [], favorites: [] }), null)
})

test('pickFood 只返回候选内的元素', () => {
  const pool = FOODS.slice(0, 5)
  const ids = new Set(pool.map((food) => food.id))
  for (let i = 0; i < 200; i += 1) {
    assert.ok(ids.has(pickFood(pool, {}).id))
  }
})

test('sampleFoods 不放回：无重复且数量正确', () => {
  const picked = sampleFoods(FOODS, 10)
  assert.equal(picked.length, 10)
  assert.equal(new Set(picked.map((food) => food.id)).size, 10)

  const big = sampleFoods(FOODS, 120)
  assert.equal(big.length, 120)
  assert.equal(new Set(big.map((food) => food.id)).size, 120)
})

test('sampleFoods 候选不足时返回全部且不重复', () => {
  const pool = FOODS.slice(0, 3)
  const picked = sampleFoods(pool, 10)
  assert.equal(picked.length, 3)
  assert.equal(new Set(picked.map((food) => food.id)).size, 3)
})

test('sampleFoods 不修改传入的候选数组', () => {
  const pool = FOODS.slice(0, 20)
  const snapshot = pool.slice()
  sampleFoods(pool, 5)
  assert.deepEqual(pool, snapshot)
})

test('sampleFoods 空池返回空数组', () => {
  assert.deepEqual(sampleFoods([], 8), [])
})

test('shuffle 不修改原数组且元素集合一致', () => {
  const original = [1, 2, 3, 4, 5, 6, 7, 8]
  const snapshot = original.slice()
  const shuffled = shuffle(original)

  assert.deepEqual(original, snapshot, '原数组被修改了')
  assert.notEqual(shuffled, original, 'shuffle 应返回新数组')
  assert.equal(shuffled.length, original.length)
  assert.deepEqual(shuffled.slice().sort((a, b) => a - b), snapshot)

  assert.deepEqual(shuffle([]), [])
  assert.deepEqual(shuffle([1]), [1])
})

/* ================================================================== */
/* 地点（region）维度                                                   */
/* ================================================================== */

test('REGIONS 枚举含 local 与 parsons-nyc，且 key 唯一', () => {
  const keys = REGIONS.map((item) => item.key)
  assert.ok(keys.includes('local'))
  assert.ok(keys.includes('parsons-nyc'))
  assert.equal(new Set(keys).size, keys.length)
  assert.equal(DEFAULT_FILTERS.region, 'local')
})

test('region=local（平时）只保留未标注地点的国内条目', () => {
  const pool = filterFoods({ region: 'local' })
  assert.ok(pool.length > 0, '平时不应为空')
  assert.equal(pool.filter((food) => food.region).length, 0, '平时混入了标注了地点的条目')
})

test('region=parsons-nyc 只保留纽约条目', () => {
  const pool = filterFoods({ region: 'parsons-nyc' })
  assert.ok(pool.length > 0, '纽约条目不应为空')
  assert.equal(
    pool.filter((food) => food.region !== 'parsons-nyc').length,
    0,
    '纽约结果混入了非纽约条目',
  )
  assert.ok(
    pool.every((food) => typeof food.address === 'string' && food.address.length > 0),
    '纽约条目必须带非空 address',
  )
})

test('local 与 parsons-nyc 两个池子互斥且并集等于全量', () => {
  const local = filterFoods({ region: 'local' })
  const nyc = filterFoods({ region: 'parsons-nyc' })
  const localIds = new Set(local.map((food) => food.id))

  assert.equal(nyc.filter((food) => localIds.has(food.id)).length, 0, '两个池子出现交集')
  assert.equal(local.length + nyc.length, FOODS.length, '两个池子的并集不等于全量')
})

test('不传 region 或传「随机」时不限制地点（返回全量）', () => {
  assert.equal(filterFoods({}).length, FOODS.length)
  assert.equal(filterFoods({ region: undefined }).length, FOODS.length)
  assert.equal(filterFoods({ region: '随机' }).length, FOODS.length)
})

test('地点与预算 / 口味 / 忌口可以叠加生效', () => {
  const nyc = filterFoods({ region: 'parsons-nyc' })
  const spicyNyc = filterFoods({ region: 'parsons-nyc', taste: '辣' })
  assert.ok(spicyNyc.every((food) => food.taste === '辣' && food.region === 'parsons-nyc'))
  assert.ok(spicyNyc.length <= nyc.length)

  // 预算：沿用 matchBudget「价格区间与档位区间求交集」的口径逐条核对。
  // 纽约店人均普遍高于「20元以内」，但确实有个别单片披萨落在该档位，
  // 所以这里不做「纽约店一定超预算」的假设，只要求筛选确实起了作用。
  const cheap = { key: 'cheap', min: 0, max: 20 }
  const expectCheap = nyc.filter((food) => food.price[1] >= cheap.min && food.price[0] <= cheap.max)
  const cheapPool = filterFoods({ region: 'parsons-nyc', budget: cheap })
  assert.equal(cheapPool.length, expectCheap.length, `预算筛选结果 ${cheapPool.length} ≠ 期望 ${expectCheap.length}`)
  assert.ok(cheapPool.length < nyc.length, '预算档位对纽约店完全没有筛选作用')

  // 忌口：纽约条目里带 exclusions 的，在被排除后必须从结果里消失
  const withTag = nyc.find((food) => food.exclusions.length > 0)
  assert.ok(withTag, '纽约条目应至少有一条带 exclusions，否则忌口筛选对纽约店失效')
  const tag = withTag.exclusions[0]
  const excluded = filterFoods({ region: 'parsons-nyc', exclusions: [tag] })
  assert.equal(excluded.filter((food) => food.id === withTag.id).length, 0)
})

test('buildWheelPool 遵守 region 且不补入条件外的食物', () => {
  const filters = toPickerFilters({ ...DEFAULT_FILTERS, region: 'parsons-nyc' })
  const pool = buildWheelPool(filters, {}, 10)
  const eligible = filterFoods(filters)

  assert.equal(pool.length, Math.min(10, eligible.length))
  assert.ok(pool.every((food) => food.region === 'parsons-nyc'))
  assert.equal(new Set(pool.map((food) => food.id)).size, pool.length)

  // 平时池子里绝不能出现纽约店
  const localPool = buildWheelPool(toPickerFilters({ ...DEFAULT_FILTERS, region: 'local' }), {}, 10)
  assert.equal(localPool.filter((food) => food.region).length, 0)
})

test('默认筛选（平时）随机多次都不会抽到纽约店', () => {
  const filters = toPickerFilters(DEFAULT_FILTERS)
  const pool = filterFoods(filters)
  assert.equal(pool.filter((food) => food.region).length, 0)

  for (let i = 0; i < 500; i += 1) {
    const picked = pickFood(pool, {})
    assert.equal(picked.region, undefined, `默认随机抽到了外地店铺：${picked.id}`)
  }
})
