#!/usr/bin/env node
/**
 * storage.js 单元测试
 * ------------------------------------------------------------------
 * 运行：node --test tests/unit/
 * 零第三方依赖，使用 Node 22 自带的 node:test + node:assert。
 * 与 picker.test.cjs 同样的 module.registerHooks 方案
 * （无扩展名相对导入补 '.js'），另加内存版 localStorage /
 * sessionStorage 桩：storage.js 只在调用时访问 window，
 * 因此在动态 import 之前把 globalThis.window 准备好即可。
 */

'use strict'

const path = require('node:path')
const Module = require('node:module')
const { pathToFileURL } = require('node:url')
const { test, before, beforeEach } = require('node:test')
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

/* ------------------------- 存储桩 ------------------------- */

const makeStore = () => {
  const data = new Map()
  return {
    getItem: (key) => (data.has(String(key)) ? data.get(String(key)) : null),
    setItem: (key, value) => {
      data.set(String(key), String(value))
    },
    removeItem: (key) => {
      data.delete(String(key))
    },
    clear: () => data.clear(),
  }
}

// 必须在 import storage.js 之前就绪
globalThis.window = {
  localStorage: makeStore(),
  sessionStorage: makeStore(),
}

const ROOT = path.join(__dirname, '..', '..')
const SRC = path.join(ROOT, 'src')
const load = (relative) => import(pathToFileURL(path.join(SRC, relative)).href)

let storage

before(async () => {
  storage = await load('lib/storage.js')
})

beforeEach(() => {
  window.localStorage.clear()
  window.sessionStorage.clear()
})

/* ================================================================== */
/* normalizeStats / normalizeDrinkStats —— 脏数据归一化                  */
/* ================================================================== */

test('normalizeStats：脏字段回退默认值', () => {
  assert.deepEqual(storage.normalizeStats({ totalDecided: NaN, firstUsedAt: 'x' }), {
    totalDecided: 0,
    firstUsedAt: null,
  })
  assert.deepEqual(storage.normalizeStats({ totalDecided: -5 }), {
    totalDecided: 0,
    firstUsedAt: null,
  })
  // 小数向下取整
  assert.deepEqual(storage.normalizeStats({ totalDecided: 3.9, firstUsedAt: 100 }), {
    totalDecided: 3,
    firstUsedAt: 100,
  })
  // 非对象整体回退
  assert.deepEqual(storage.normalizeStats(null), { totalDecided: 0, firstUsedAt: null })
  assert.deepEqual(storage.normalizeStats('oops'), { totalDecided: 0, firstUsedAt: null })
  // 合法值原样保留
  assert.deepEqual(storage.normalizeStats({ totalDecided: 7, firstUsedAt: 123 }), {
    totalDecided: 7,
    firstUsedAt: 123,
  })
})

test('normalizeDrinkStats：与食物侧同一套校验', () => {
  assert.deepEqual(storage.normalizeDrinkStats({ totalDecided: NaN }), {
    totalDecided: 0,
    firstUsedAt: null,
  })
  assert.deepEqual(storage.normalizeDrinkStats({ totalDecided: 2, firstUsedAt: 50 }), {
    totalDecided: 2,
    firstUsedAt: 50,
  })
})

test('loadStats / saveStats 回环：写入后再读保持归一化', () => {
  storage.saveStats({ totalDecided: 5, firstUsedAt: 999 })
  assert.deepEqual(storage.loadStats(), { totalDecided: 5, firstUsedAt: 999 })
  // 直接塞脏 JSON，读时仍被归一化
  window.localStorage.setItem('tqsc:v1:stats', '{"totalDecided":"很多","firstUsedAt":-1}')
  assert.deepEqual(storage.loadStats(), { totalDecided: 0, firstUsedAt: null })
})

/* ================================================================== */
/* parseBackup —— 大小校验用 UTF-8 字节数                                */
/* ================================================================== */

test('parseBackup：用 UTF-8 字节数而非字符串 length 做大小校验', () => {
  // '中' 1 个码元 = 3 字节：18 万个码元（< 512K 上限）实际 54 万字节（> 上限），必须拒绝
  const sneaky = '中'.repeat(180000)
  assert.ok(sneaky.length < storage.MAX_BACKUP_BYTES, '前置条件：码元数未超上限')
  assert.ok(
    new TextEncoder().encode(sneaky).length > storage.MAX_BACKUP_BYTES,
    '前置条件：字节数已超上限'
  )
  const result = storage.parseBackup(sneaky)
  assert.equal(result.ok, false)
  assert.match(result.reason, /文件过大/)
})

test('parseBackup：合法 v2 备份回环', () => {
  const payload = storage.buildBackup({
    history: [{ uid: 'u1', id: 'x', ts: 100 }],
    favorites: ['x'],
    exclusions: ['香菜'],
    filterPrefs: { taste: '辣' },
    stats: { totalDecided: 3, firstUsedAt: 42 },
    drinkHistory: [],
    drinkFavorites: [],
    drinkExclusions: [],
    drinkPrefs: { brand: '随机' },
    drinkStats: { totalDecided: 1, firstUsedAt: null },
  })
  const parsed = storage.parseBackup(storage.serializeBackup(payload))
  assert.equal(parsed.ok, true)
  assert.deepEqual(parsed.data.stats, { totalDecided: 3, firstUsedAt: 42 })
  assert.deepEqual(parsed.data.filterPrefs.taste, '辣')
  assert.equal(parsed.present.stats, true)
  assert.equal(parsed.present.filterPrefs, true)
  assert.equal(parsed.present.drinkStats, true)
})

test('parseBackup：v1 老备份缺失饮料字段时 present 标记为 false', () => {
  const raw = JSON.stringify({
    app: 'today-eat-what',
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    data: {
      history: [],
      favorites: [],
      exclusions: [],
      filterPrefs: { taste: '辣' },
      stats: { totalDecided: 2, firstUsedAt: null },
    },
  })
  const parsed = storage.parseBackup(raw)
  assert.equal(parsed.ok, true)
  assert.ok(parsed.warnings.some((w) => w.includes('v1')))
  assert.equal(parsed.present.drinkPrefs, false)
  assert.equal(parsed.present.drinkStats, false)
  assert.equal(parsed.present.stats, true)
})

test('parseBackup：stats 脏数据被归一化而非透传', () => {
  const raw = JSON.stringify({
    app: 'today-eat-what',
    formatVersion: 2,
    exportedAt: new Date().toISOString(),
    data: {
      history: [],
      favorites: [],
      exclusions: [],
      stats: { totalDecided: NaN, firstUsedAt: '昨天' },
      drinkStats: { totalDecided: Infinity },
    },
  })
  const parsed = storage.parseBackup(raw)
  assert.equal(parsed.ok, true)
  // JSON 里写不出 NaN/Infinity，会变成 null：归一化后应为默认值
  assert.deepEqual(parsed.data.stats, { totalDecided: 0, firstUsedAt: null })
  assert.deepEqual(parsed.data.drinkStats, { totalDecided: 0, firstUsedAt: null })
})

test('parseBackup：非法输入被拒绝', () => {
  assert.equal(storage.parseBackup('').ok, false)
  assert.equal(storage.parseBackup('{broken').ok, false)
  assert.equal(storage.parseBackup(null).ok, false)
  assert.equal(
    storage.parseBackup(JSON.stringify({ app: 'other-app', formatVersion: 2, data: {} })).ok,
    false
  )
})

/* ================================================================== */
/* mergeImported —— 并集合并 + 统计合并语义                               */
/* ================================================================== */

test('mergeImported：历史/收藏/忌口做并集合并，不删除现有数据', () => {
  const merged = storage.mergeImported(
    {
      history: [{ uid: 'a', id: 'x', ts: 200 }],
      favorites: ['x'],
      exclusions: ['香菜'],
    },
    {
      history: [
        { uid: 'a', id: 'x', ts: 200 },
        { uid: 'b', id: 'y', ts: 100 },
      ],
      favorites: ['x', 'y'],
      exclusions: ['内脏'],
    }
  )
  assert.deepEqual(
    merged.history.map((r) => r.uid),
    ['a', 'b']
  )
  assert.deepEqual(merged.favorites.sort(), ['x', 'y'])
  assert.deepEqual(merged.exclusions.sort(), ['内脏', '香菜'])
  assert.equal(merged.added.history, 1)
  assert.equal(merged.added.favorites, 1)
})

test('mergeImported：统计取 max(次数) + 最早(首次使用)，不丢失不膨胀', () => {
  const merged = storage.mergeImported(
    { stats: { totalDecided: 10, firstUsedAt: 300 }, drinkStats: { totalDecided: 4, firstUsedAt: 400 } },
    { stats: { totalDecided: 3, firstUsedAt: 100 }, drinkStats: { totalDecided: 9, firstUsedAt: null } }
  )
  assert.deepEqual(merged.stats, { totalDecided: 10, firstUsedAt: 100 })
  assert.deepEqual(merged.drinkStats, { totalDecided: 9, firstUsedAt: 400 })
})

test('mergeImported：缺失的偏好/统计回退为当前值或默认值', () => {
  const merged = storage.mergeImported({ stats: { totalDecided: 5, firstUsedAt: 50 } }, {})
  assert.deepEqual(merged.stats, { totalDecided: 5, firstUsedAt: 50 })
  // 偏好缺失时归一化为默认值（调用方按 present 标记决定是否应用）
  assert.equal(merged.filterPrefs.taste, '随机')
})

/* ================================================================== */
/* createHistoryRecord / createDrinkHistoryRecord —— uid 唯一性          */
/* ================================================================== */

test('createHistoryRecord：uid 唯一且随机段足够长', () => {
  const seen = new Set()
  for (let i = 0; i < 2000; i += 1) {
    const record = storage.createHistoryRecord({
      id: 'x',
      name: 'x',
      emoji: '🍚',
      category: '米饭',
      taste: '辣',
    })
    assert.ok(!seen.has(record.uid), `uid 碰撞：${record.uid}`)
    seen.add(record.uid)
    const randomPart = record.uid.split('-')[1]
    assert.ok(randomPart.length >= 10, `随机段过短：${randomPart}`)
  }
})

test('createDrinkHistoryRecord：uid 唯一，sweetness 缺失不抛错', () => {
  const seen = new Set()
  for (let i = 0; i < 500; i += 1) {
    const record = storage.createDrinkHistoryRecord({ id: 'd1', name: 'x', category: '奶茶' })
    assert.ok(!seen.has(record.uid), `uid 碰撞：${record.uid}`)
    seen.add(record.uid)
  }
  const record = storage.createDrinkHistoryRecord({ id: 'd1', name: 'x', category: '奶茶' })
  assert.equal(record.taste, null)
})

test('parseBackup：偏好/统计字段类型错误时视为缺失并警告，不静默覆盖', () => {
  const raw = JSON.stringify({
    app: 'today-eat-what',
    formatVersion: 2,
    exportedAt: new Date().toISOString(),
    data: {
      history: [],
      favorites: [],
      exclusions: [],
      filterPrefs: '辣', // 应为对象
      stats: 123, // 应为对象
      drinkPrefs: ['随机'], // 应为对象
      drinkStats: null, // null 视为缺失（JSON 里写不出 undefined）
    },
  })
  const parsed = storage.parseBackup(raw)
  assert.equal(parsed.ok, true)
  // 类型错误的字段 present 为 false：importBackup 不会用洗成默认值的数据覆盖用户当前值
  assert.equal(parsed.present.filterPrefs, false)
  assert.equal(parsed.present.stats, false)
  assert.equal(parsed.present.drinkPrefs, false)
  assert.equal(parsed.present.drinkStats, false)
  // 每条都有警告，用户能看到"已跳过（保留当前…）"
  for (const keyword of ['筛选偏好', '统计', '饮料筛选偏好', '饮料统计']) {
    assert.ok(
      parsed.warnings.some((w) => w.includes(keyword)),
      `缺少关于「${keyword}」的警告`
    )
  }
})

test('normalizeStats：totalDecided 封顶 1e6，避免首页显示 1e+30', () => {
  assert.equal(storage.normalizeStats({ totalDecided: 1e30, firstUsedAt: null }).totalDecided, 1e6)
  assert.equal(storage.normalizeDrinkStats({ totalDecided: 1e30, firstUsedAt: null }).totalDecided, 1e6)
  // 正常值不受影响
  assert.equal(storage.normalizeStats({ totalDecided: 42, firstUsedAt: null }).totalDecided, 42)
})
