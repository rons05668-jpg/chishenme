#!/usr/bin/env node
/**
 * drinks-meta.js 与 drinks.js 的枚举一致性测试
 * ------------------------------------------------------------------
 * 209KB 的 DRINKS 大表（src/data/drinks.js）只在饮品页 chunk 里加载，
 * 首屏模块（storage.js 等）从轻量的 src/data/drinks-meta.js 导入枚举。
 * 两处是同一套枚举的字面量复刻——改一处必须同步改另一处，
 * 本测试强制保证它们一致，拦住"只改一处"的不一致。
 *
 * 注意：getDrinkById 是故意不一致的（drinks.js 查大表，drinks-meta.js
 * 在首屏恒返回 null 并由调用方兜底），因此不在一致性断言之列。
 *
 * 运行：node --test tests/unit/
 * 与 picker.test.cjs 同样的 module.registerHooks 方案。
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

const SRC = path.join(__dirname, '..', '..', 'src')
const load = (relative) => import(pathToFileURL(path.join(SRC, relative)).href)

/** 两处必须字面量一致的枚举（数据常量） */
const PARITY_KEYS = [
  'DRINK_CATEGORIES',
  'TEMPERATURES',
  'SUGAR_LEVELS',
  'CAFFEINE_LEVELS',
  'DRINK_SCENES',
  'DRINK_BUDGETS',
  'DRINK_EXCLUSIONS',
  'PRICE_STATUS',
  'CATEGORY_EMOJI',
]

let big
let meta

before(async () => {
  big = await load('data/drinks.js')
  meta = await load('data/drinks-meta.js')
})

test('枚举字面量在 drinks.js 与 drinks-meta.js 中完全一致', () => {
  for (const key of PARITY_KEYS) {
    assert.deepEqual(
      meta[key],
      big[key],
      `枚举 ${key} 在两处不一致：改枚举时必须同步改 drinks.js 与 drinks-meta.js`,
    )
  }
})

test('drinkEmoji 在两处对同一品类的行为一致', () => {
  const categories = [...Object.keys(big.CATEGORY_EMOJI), '不存在的品类', undefined]
  for (const category of categories) {
    assert.equal(
      meta.drinkEmoji({ category }),
      big.drinkEmoji({ category }),
      `drinkEmoji({ category: ${String(category)} }) 在两处行为不一致`,
    )
  }
})

test('getDrinkById 在 drinks-meta.js 中恒返回 null（设计如此，调用方有兜底）', () => {
  assert.equal(meta.getDrinkById('drink-xxx'), null)
  assert.equal(typeof big.getDrinkById, 'function')
})
