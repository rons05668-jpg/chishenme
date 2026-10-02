/**
 * 合并各品牌核验结果到 src/data/drinks.js 的规范 schema。
 * ------------------------------------------------------------------
 * 各 brand agent 输出的字段名与规范 schema 不同：
 *   temperatureOptions → temperatures
 *   sweetnessOptions   → sweetness
 *   caffeineStatus     → caffeine（值域需映射）
 *   priceRange         → priceRange + priceStatus 推导
 * 这个脚本负责统一，避免手改 200 条数据出错。
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

/** 与 src/data/drinks.js 保持一致的枚举（规范化时用于校验） */
const TEMPERATURES = ['冰', '常温', '热']
const SUGAR_LEVELS = ['无糖', '少糖', '正常糖']

/* ---------------------- 字段映射 ---------------------- */

/** agent 用英文值，规范 schema 用中文值 */
const CAFFEINE_MAP = {
  'caffeine-free': '无咖啡因',
  contains: '高咖啡因',
  unknown: 'unknown',
}

/**
 * 温度 / 甜度用词的规范化。
 * 各品牌（尤其是贡茶的台湾菜单）使用与本地枚举不同的措辞，
 * 这里做等价映射而不是丢弃——丢弃会丢失官方确实公示过的信息。
 *  台湾「冷」≈ 本地「冰」（台湾冷饮通常即加冰）
 *  「标准」≈「正常糖」，「微糖」在少糖与无糖之间，归入「少糖」（偏保守，不虚报无糖）
 */
const TEMPERATURE_ALIAS = {
  冷: '冰',
  冰饮: '冰',
  热饮: '热',
  去冰: '冰',
  常温: '常温',
}

const SWEETNESS_ALIAS = {
  标准: '正常糖',
  正常: '正常糖',
  全糖: '正常糖',
  微糖: '少糖',
  半糖: '少糖',
  少糖: '少糖',
  无糖: '无糖',
  不加糖: '无糖',
}

/**
 * brandId 修正表。
 * 'hsaytea' 曾同时是「沪上阿姨」的内部 id 和一个假冒域名（hsaytea.cn）的名字，
 * 容易造成「内部 id 认可了该域名」的误读。品牌表已改用 'hsys'，
 * 这里把历史数据里的旧 id 一并迁移。
 */
const BRAND_ID_ALIAS = {
  hsaytea: 'hsys',
}

function normalizeList(list, aliasMap, allowed) {
  const out = []
  for (const raw of list || []) {
    const mapped = aliasMap[raw] || raw
    if (allowed.includes(mapped) && !out.includes(mapped)) out.push(mapped)
  }
  return out
}

/** 推导 priceStatus：优先采信 agent 显式标注，否则按有无区间推断 */
function derivePrice(drink) {
  const hasRange = Array.isArray(drink.priceRange) && drink.priceRange.length === 2
  const declared = drink.priceStatus

  // agent 已显式标注三态时直接采信（这是主要路径）
  if (declared === 'official' || declared === 'thirdParty' || declared === 'unpublished') {
    if (declared === 'unpublished') {
      return { priceStatus: 'unpublished', priceRange: null, priceSource: null }
    }
    if (!hasRange) {
      // 声明有价但没给区间 → 降级为未公示，避免出现无价格的「有价」条目
      return { priceStatus: 'unpublished', priceRange: null, priceSource: null }
    }
    return { priceStatus: declared, priceRange: drink.priceRange, priceSource: declared }
  }

  // 兼容 agent 用 priceSourceLevel / officialInfo 等旧写法
  const level = drink.priceSourceLevel
  if (level === 'officialInfo' || level === 'official') {
    return hasRange
      ? { priceStatus: 'official', priceRange: drink.priceRange, priceSource: 'official' }
      : { priceStatus: 'unpublished', priceRange: null, priceSource: null }
  }

  if (!hasRange) {
    return { priceStatus: 'unpublished', priceRange: null, priceSource: null }
  }
  return { priceStatus: 'thirdParty', priceRange: drink.priceRange, priceSource: 'thirdParty' }
}

function normalize(drink) {
  const price = derivePrice(drink)
  return {
    id: drink.id,
    brandId: BRAND_ID_ALIAS[drink.brandId] || drink.brandId,
    name: drink.name,
    nameTranslated: Boolean(drink.nameTranslated),
    aliases: drink.aliases || [],
    category: drink.category,
    priceStatus: price.priceStatus,
    priceRange: price.priceRange,
    priceNote: drink.priceNote || null,
    priceSource: price.priceSource,
    availability: drink.availability || 'unknown',
    availabilityNote: drink.availabilityNote || null,
    temperatures: normalizeList(
      drink.temperatureOptions || drink.temperatures,
      TEMPERATURE_ALIAS,
      TEMPERATURES
    ),
    sweetness: normalizeList(
      drink.sweetnessOptions || drink.sweetness,
      SWEETNESS_ALIAS,
      SUGAR_LEVELS
    ),
    ingredientTags: drink.ingredientTags || [],
    caffeine: CAFFEINE_MAP[drink.caffeineStatus] || drink.caffeine || 'unknown',
    caffeineNote: drink.caffeineNote || null,
    scenes: drink.scenes || ['外卖', '出去吃'],
    sources: drink.sources || [],
    verifiedAt: drink.verifiedAt || '2026-09-20',
    desc: drink.desc || null,
  }
}

/* ---------------------- 读取各 agent 输出 ---------------------- */

/**
 * 各 agent 的输出文件路径。有的以 `const XXX = [...]` 形式给出，
 * 用正则把数组字面量抽出来再用 Function 求值（数据是纯对象字面量，无副作用）。
 */
const SOURCES = [
  { label: 'brand-a', file: 'C:/Users/25488/AppData/Local/Temp/brand_a_output.js', varName: 'BRAND_A_DRINKS' },
  { label: 'brand-b', file: 'C:/Users/25488/AppData/Local/Temp/brand_b_output.js', varName: 'BRAND_B_DRINKS' },
  { label: 'brand-c', file: 'C:/Users/25488/AppData/Local/Temp/brand_c_output.js', varName: 'BRAND_C_DRINKS' },
  { label: 'brand-d', file: 'C:/Users/25488/AppData/Local/Temp/brand_d_output.js', varName: 'BRAND_D_DRINKS' },
]

function extractArray(text, varName) {
  const start = text.indexOf(`${varName} = [`)
  if (start === -1) throw new Error(`未找到 ${varName}`)
  const arrStart = text.indexOf('[', start)
  // 括号配对扫描，找到数组结尾
  let depth = 0
  let end = -1
  let inString = null
  for (let i = arrStart; i < text.length; i += 1) {
    const ch = text[i]
    if (inString) {
      if (ch === '\\') { i += 1; continue }
      if (ch === inString) inString = null
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') { inString = ch; continue }
    if (ch === '[') depth += 1
    else if (ch === ']') {
      depth -= 1
      if (depth === 0) { end = i; break }
    }
  }
  if (end === -1) throw new Error(`${varName} 数组未闭合`)
  return text.slice(arrStart, end + 1)
}

const collected = []
for (const source of SOURCES) {
  if (!fs.existsSync(source.file)) {
    console.log(`[skip] ${source.label}: 文件不存在 ${source.file}`)
    continue
  }
  const text = fs.readFileSync(source.file, 'utf8')
  const literal = extractArray(text, source.varName)
  const list = new Function(`return ${literal}`)()
  console.log(`[load] ${source.label}: ${list.length} 条`)
  collected.push(...list)
}

console.log(`\n合计 ${collected.length} 条`)

// 空输入保护：SOURCES 全是本机硬编码路径，换台机器会全部 [skip]。
// 此时 collected 为空，若继续往下跑会把 DRINKS_RAW 替换成空数组，
// 一次误操作就清空全部饮品数据。直接报错退出。
if (!collected.length) {
  console.error('merge-drinks: 没有收集到任何输入，拒绝清空 DRINKS_RAW')
  process.exit(1)
}

/* ---------------------- 校验 ---------------------- */

const ids = new Set()
const problems = []
const normalized = []

for (const raw of collected) {
  const d = normalize(raw)
  if (!d.id || !d.id.startsWith('drink-')) problems.push(`id 不规范: ${d.id}`)
  if (ids.has(d.id)) {
    // 真去重：保留第一条，剔除重复项并在 warning 里列出被剔除的 id
    problems.push(`id 重复，已剔除: ${d.id}`)
    continue
  }
  ids.add(d.id)
  if (!d.brandId) problems.push(`缺 brandId: ${d.id}`)
  if (!d.name) problems.push(`缺 name: ${d.id}`)
  if (d.priceStatus === 'unpublished' && d.priceRange !== null) problems.push(`价格状态矛盾: ${d.id}`)
  normalized.push(d)
}

if (problems.length) {
  console.log('\n发现问题：')
  problems.forEach((p) => console.log('  - ' + p))
}

/* ---------------------- 输出统计 ---------------------- */

const byBrand = {}
const byAvailability = {}
const byPrice = {}
for (const d of normalized) {
  byBrand[d.brandId] = (byBrand[d.brandId] || 0) + 1
  byAvailability[d.availability] = (byAvailability[d.availability] || 0) + 1
  byPrice[d.priceStatus] = (byPrice[d.priceStatus] || 0) + 1
}
console.log('\n品牌分布:', JSON.stringify(byBrand, null, 2))
console.log('在售状态:', JSON.stringify(byAvailability, null, 2))
console.log('价格来源:', JSON.stringify(byPrice, null, 2))

/* ---------------------- 生成 JS 字面量 ---------------------- */

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const arr = (list) => (list.length ? `[${list.map((x) => `'${esc(x)}'`).join(', ')}]` : '[]')
const str = (s) => (s ? `'${esc(s)}'` : 'null')

const lines = normalized.map((d) => {
  const parts = [
    `    id: '${esc(d.id)}',`,
    `    brandId: '${esc(d.brandId)}',`,
    `    name: '${esc(d.name)}',`,
    `    nameTranslated: ${d.nameTranslated},`,
    `    aliases: ${arr(d.aliases)},`,
    `    category: '${esc(d.category)}',`,
    `    priceStatus: '${d.priceStatus}',`,
    `    priceRange: ${d.priceRange ? `[${d.priceRange[0]}, ${d.priceRange[1]}]` : 'null'},`,
    `    priceNote: ${str(d.priceNote)},`,
    `    priceSource: ${str(d.priceSource)},`,
    `    availability: '${d.availability}',`,
    `    availabilityNote: ${str(d.availabilityNote)},`,
    `    temperatures: ${arr(d.temperatures)},`,
    `    sweetness: ${arr(d.sweetness)},`,
    `    ingredientTags: ${arr(d.ingredientTags)},`,
    `    caffeine: '${d.caffeine}',`,
    `    caffeineNote: ${str(d.caffeineNote)},`,
    `    scenes: ${arr(d.scenes)},`,
    `    sources: ${arr(d.sources)},`,
    `    verifiedAt: '${d.verifiedAt}',`,
    `    desc: ${str(d.desc)},`,
  ]
  return `  {\n${parts.join('\n')}\n  },`
})

fs.writeFileSync(path.join(ROOT, 'scripts', '_merged_drinks.txt'), lines.join('\n'), 'utf8')
console.log(`\n已写出 ${normalized.length} 条到 scripts/_merged_drinks.txt`)

/*
 * 同步注入 src/data/drinks.js。
 * 用标记注释定位，替换两个标记之间的内容，避免每次人工粘贴。
 */
const DRINKS_PATH = path.join(ROOT, 'src', 'data', 'drinks.js')
const START = 'const DRINKS_RAW = ['
const END = '\n]\n\n/* ------------------------------ 派生导出 ------------------------------ */'

const current = fs.readFileSync(DRINKS_PATH, 'utf8')
const startIdx = current.indexOf(START)
const endIdx = current.indexOf(END)

if (startIdx !== -1 && endIdx !== -1) {
  const before = current.slice(0, startIdx + START.length)
  const after = current.slice(endIdx)
  fs.writeFileSync(DRINKS_PATH, `${before}\n${lines.join('\n')}${after}`, 'utf8')
  console.log(`已注入 src/data/drinks.js`)
} else {
  console.log('[warn] 未找到注入标记，drinks.js 未改动，请手动合并 scripts/_merged_drinks.txt')
}
