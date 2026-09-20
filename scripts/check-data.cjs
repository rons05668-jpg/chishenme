#!/usr/bin/env node
/**
 * 食物数据与推荐算法自检脚本
 * ------------------------------------------------------------------
 * 运行：node scripts/check-data.cjs
 * 零第三方依赖，纯 CommonJS。
 *
 * 说明：src 下的源码是 ESM，且 picker.js / filters.js 使用了 Vite 风格的
 * 「无扩展名相对导入」（如 from '../data/foods'）。原生 Node ESM 不做扩展名
 * 补全，因此这里通过 module.registerHooks 注册一个同步 resolve 钩子，
 * 仅在内存中把无扩展名的相对路径补成 '.js'，不修改任何 src 源码。
 */

'use strict'

const path = require('node:path')
const Module = require('node:module')
const { pathToFileURL } = require('node:url')

Module.registerHooks({
  resolve(specifier, context, nextResolve) {
    const isRelative = specifier.startsWith('./') || specifier.startsWith('../')
    if (isRelative && !path.extname(specifier)) {
      return nextResolve(`${specifier}.js`, context)
    }
    return nextResolve(specifier, context)
  },
})

const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'src')

/* ------------------------------------------------------------------ */
/* 极简断言 / 报告框架                                                  */
/* ------------------------------------------------------------------ */

const results = []

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

/** 执行一项检查；fn 返回用于展示的细节字符串，抛错即视为失败 */
function check(label, fn) {
  try {
    results.push({ label, ok: true, detail: fn() })
  } catch (error) {
    results.push({ label, ok: false, detail: error && error.message ? error.message : String(error) })
  }
}

/** 按终端显示宽度对齐（CJK 字符按 2 列计算） */
function displayWidth(text) {
  let width = 0
  for (const char of text) {
    const code = char.codePointAt(0)
    const wide =
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x1f300 && code <= 0x1faff)
    width += wide ? 2 : 1
  }
  return width
}

function padEndWidth(text, width) {
  return text + ' '.repeat(Math.max(0, width - displayWidth(text)))
}

const isNonEmptyString = (value) => typeof value === 'string' && value.length > 0
const idsOf = (list) => new Set(list.map((food) => food.id))
const sameIdSet = (a, b) => {
  const setA = idsOf(a)
  const setB = idsOf(b)
  if (setA.size !== setB.size) return false
  for (const id of setA) if (!setB.has(id)) return false
  return true
}

/* ------------------------------------------------------------------ */
/* 主流程                                                              */
/* ------------------------------------------------------------------ */

async function main() {
  const foodsMod = await import(pathToFileURL(path.join(SRC, 'data', 'foods.js')).href)
  const pickerMod = await import(pathToFileURL(path.join(SRC, 'lib', 'picker.js')).href)
  const filtersMod = await import(pathToFileURL(path.join(SRC, 'lib', 'filters.js')).href)
  const storage = await import(pathToFileURL(path.join(SRC, 'lib', 'storage.js')).href)

  const {
    FOODS,
    FOOD_MAP,
    getFoodById,
    CATEGORIES,
    TASTES,
    SCENES,
    BUDGETS,
    SHORT_NAMES,
    shortName,
    matchBudget,
  } = foodsMod

  const {
    filterFoods,
    daysSinceLastEaten,
    weightOf,
    pickFood,
    sampleFoods,
    shuffle,
    buildWheelPool,
  } = pickerMod

  const { DEFAULT_FILTERS, toPickerFilters } = filtersMod

  const budgetByKey = (key) => BUDGETS.find((item) => item.key === key)
  const defaultPickerFilters = toPickerFilters(DEFAULT_FILTERS)

  /* ------------------------- 数据完整性 ------------------------- */

  check('01 食物条目数与名称无重复', () => {
    assert(Number.isInteger(FOODS.length), 'FOODS 不是数组')
    assert(FOODS.length === 249, `期望 249 条：实际 ${FOODS.length} 条`)
    assert(new Set(FOODS.map((f) => f.name.trim())).size === FOODS.length, '存在重复名称')
    assert(CATEGORIES.length === 11, '应有 11 个食物类型')
    return `${FOODS.length} 条`
  })

  check('02 所有 id 唯一', () => {
    const seen = new Set()
    const duplicates = []
    for (const food of FOODS) {
      if (seen.has(food.id)) duplicates.push(food.id)
      seen.add(food.id)
    }
    assert(duplicates.length === 0, `存在重复 id：${duplicates.join(', ')}`)
    return `${seen.size} 个唯一 id`
  })

  check('03 字段齐全且类型正确', () => {
    const problems = []
    FOODS.forEach((food, index) => {
      const at = `第 ${index + 1} 条(${food && food.id ? food.id : '无 id'})`
      for (const field of ['id', 'name', 'emoji', 'category', 'taste', 'desc']) {
        if (!isNonEmptyString(food[field])) problems.push(`${at} 的 ${field} 不是非空字符串`)
      }
      const price = food.price
      if (!Array.isArray(price) || price.length !== 2) {
        problems.push(`${at} 的 price 不是长度 2 的数组`)
      } else if (!price.every((value) => typeof value === 'number' && Number.isFinite(value))) {
        problems.push(`${at} 的 price 含非数字项`)
      } else if (price[0] > price[1]) {
        problems.push(`${at} 的 price 最小值 ${price[0]} > 最大值 ${price[1]}`)
      }
      const scenes = food.scenes
      if (!Array.isArray(scenes) || scenes.length === 0) {
        problems.push(`${at} 的 scenes 不是非空数组`)
      } else if (!scenes.every(isNonEmptyString)) {
        problems.push(`${at} 的 scenes 含非法项`)
      }
    })
    assert(problems.length === 0, problems.slice(0, 5).join('；'))
    return `${FOODS.length} 条记录字段与类型均合法`
  })

  check('04 category / taste / scenes 取值合法', () => {
    const categorySet = new Set(CATEGORIES)
    const tasteSet = new Set(TASTES)
    const sceneSet = new Set(SCENES)
    const problems = []
    for (const food of FOODS) {
      if (!categorySet.has(food.category)) problems.push(`${food.id} 的 category「${food.category}」越界`)
      if (!tasteSet.has(food.taste)) problems.push(`${food.id} 的 taste「${food.taste}」越界`)
      for (const scene of food.scenes) {
        if (!sceneSet.has(scene)) problems.push(`${food.id} 的 scene「${scene}」越界`)
      }
    }
    assert(problems.length === 0, problems.slice(0, 5).join('；'))
    return `枚举范围内（${CATEGORIES.length} 类 / ${TASTES.length} 味 / ${SCENES.length} 场景）`
  })

  check('05 FOOD_MAP 与 getFoodById 一致', () => {
    const mapKeys = Object.keys(FOOD_MAP)
    assert(mapKeys.length === FOODS.length, `FOOD_MAP 键数 ${mapKeys.length} ≠ FOODS 长度 ${FOODS.length}`)
    const missing = FOODS.filter((food) => {
      const found = getFoodById(food.id)
      return !found || found !== food
    }).map((food) => food.id)
    assert(missing.length === 0, `getFoodById 取不到或取错：${missing.slice(0, 5).join(', ')}`)
    assert(getFoodById('__不存在__') === null, 'getFoodById 对未知 id 应返回 null')
    return `${mapKeys.length} 个键全部可命中`
  })

  check('06 SHORT_NAMES 键有效且短名 ≤ 4 字', () => {
    const validIds = new Set(FOODS.map((food) => food.id))
    const badKeys = Object.keys(SHORT_NAMES).filter((key) => !validIds.has(key))
    assert(badKeys.length === 0, `SHORT_NAMES 含不存在的 id：${badKeys.join(', ')}`)

    const tooLong = []
    let maxLength = 0
    for (const food of FOODS) {
      const label = shortName(food)
      const length = [...label].length
      maxLength = Math.max(maxLength, length)
      if (length > 4) tooLong.push(`${food.id}→「${label}」(${length})`)
    }
    assert(tooLong.length === 0, `短名超过 4 字：${tooLong.slice(0, 5).join('，')}`)
    return `${Object.keys(SHORT_NAMES).length} 条映射，最长短名 ${maxLength} 字`
  })

  /* ------------------------- 算法正确性 ------------------------- */

  check('07 默认筛选返回全部食物', () => {
    const all = filterFoods(defaultPickerFilters)
    assert(all.length === FOODS.length, `返回 ${all.length} 条，期望 ${FOODS.length} 条`)
    assert(sameIdSet(all, FOODS), '返回结果与 FOODS 集合不一致')
    return `${all.length} 条 = 全量`
  })

  check('08 按 category / taste 筛选结果纯净', () => {
    const hotpot = filterFoods({ ...defaultPickerFilters, category: '火锅锅物' })
    assert(hotpot.length > 0, 'category=火锅 结果为空')
    const wrongHotpot = hotpot.filter((food) => food.category !== '火锅锅物')
    assert(wrongHotpot.length === 0, `火锅结果混入：${wrongHotpot.map((f) => f.category).join(', ')}`)

    const spicy = filterFoods({ ...defaultPickerFilters, taste: '辣' })
    assert(spicy.length > 0, 'taste=辣 结果为空')
    const wrongSpicy = spicy.filter((food) => food.taste !== '辣')
    assert(wrongSpicy.length === 0, `辣味结果混入：${wrongSpicy.map((f) => f.taste).join(', ')}`)

    return `火锅 ${hotpot.length} 条、辣味 ${spicy.length} 条，均纯净`
  })

  check('09 matchBudget 档位边界正确', () => {
    const cheap = budgetByKey('cheap')
    const mid = budgetByKey('mid')
    const high = budgetByKey('high')
    const any = budgetByKey('any')
    assert(cheap && mid && high && any, 'BUDGETS 缺少 cheap/mid/high/any 档位')

    const priceOf = (range) => ({ id: `__probe_${range[0]}_${range[1]}`, price: range })

    const low = priceOf([20, 38])
    assert(matchBudget(low, cheap) === true, '[20,38] 未命中 cheap（20元以内）')

    const middle = priceOf([25, 40])
    assert(matchBudget(middle, mid) === true, '[25,40] 未命中 mid（20–40元）')
    assert(matchBudget(middle, cheap) === false, '[25,40] 不应命中 cheap')

    const premium = priceOf([60, 130])
    assert(matchBudget(premium, high) === true, '[60,130] 未命中 high（40元以上）')
    assert(matchBudget(premium, cheap) === false, '[60,130] 不应命中 cheap')
    assert(matchBudget(premium, mid) === false, '[60,130] 不应命中 mid')

    assert(matchBudget(premium, any) === true, 'any 档位应恒为 true')
    assert(matchBudget(premium, undefined) === true, '缺省预算应视为不限')

    return '[20,38]→cheap、[25,40]→mid、[60,130]→仅high，边界正确'
  })

  check('10 weightOf 降权 / 加权符合预期', () => {
    const food = FOODS[0]
    const round2 = (value) => Math.round(value * 100) / 100
    const approx = (actual, expected) => Math.abs(actual - expected) < 1e-6

    // 基准：从未吃过时 daysSinceLastEaten 返回 Infinity，会命中 weightOf 中
    // 「days > 14 → ×1.15」的新鲜感加权分支，故基准为 100 × 1.15 = 115。
    const never = weightOf(food, {})
    assert(approx(never, 115), `从未吃过权重应为 100 × 1.15 = 115，实际 ${never}`)

    const today = weightOf(food, { history: [{ id: food.id, ts: Date.now() }] })
    assert(today < 100, `今天吃过的权重应 < 100，实际 ${today}`)
    assert(approx(today, 6), `今天吃过权重应为 100 × 0.06 = 6，实际 ${today}`)

    const disliked = weightOf(food, { dislikes: [food.id] })
    assert(disliked < 100, `命中不喜欢的权重应 < 100，实际 ${disliked}`)
    assert(approx(disliked, 11.5), `命中不喜欢权重应为 115 × 0.1 = 11.5，实际 ${disliked}`)

    const favored = weightOf(food, { favorites: [food.id] })
    assert(favored > 100, `命中收藏的权重应 > 100，实际 ${favored}`)
    assert(approx(favored, 143.75), `命中收藏权重应为 115 × 1.25 = 143.75，实际 ${favored}`)

    return `未吃过=${round2(never)}（含 1.15 新鲜感加权），今天吃过=${round2(today)}，不喜欢=${round2(disliked)}，收藏=${round2(favored)}`
  })

  check('11 daysSinceLastEaten 边界正确', () => {
    const foodId = FOODS[0].id
    const never = daysSinceLastEaten(foodId, [])
    assert(never === Infinity, `空 history 应返回 Infinity，实际 ${never}`)

    const justNow = daysSinceLastEaten(foodId, [{ id: foodId, ts: Date.now() }])
    assert(justNow === 0, `刚吃过应返回 0，实际 ${justNow}`)

    const otherId = FOODS[1].id
    const unrelated = daysSinceLastEaten(foodId, [{ id: otherId, ts: Date.now() }])
    assert(unrelated === Infinity, `history 中无该食物应返回 Infinity，实际 ${unrelated}`)

    return `空 history=${never}，刚吃过=${justNow}`
  })

  check('12 pickFood 落在候选内且降权生效', () => {
    const rounds = 5000
    const poolIds = idsOf(FOODS)

    // 用「两组各 20 个食物」做对比，而不是单点比较：
    // 单个食物的命中次数近似泊松分布，样本量小的时候容易偶发波动导致误报。
    // A 组：今天吃过（权重 ×0.06）；B 组：从未吃过（权重 ×1.15）。
    const groupA = FOODS.slice(0, 20)
    const groupB = FOODS.slice(20, 40)
    const setA = new Set(groupA.map((f) => f.id))
    const setB = new Set(groupB.map((f) => f.id))

    const context = { history: groupA.map((f) => ({ id: f.id, ts: Date.now() })) }
    let hitsA = 0
    let hitsB = 0
    for (let i = 0; i < rounds; i += 1) {
      const picked = pickFood(FOODS, context)
      assert(picked !== null, 'pickFood 返回了 null')
      assert(poolIds.has(picked.id), `抽中了候选之外的食物：${picked.id}`)
      if (setA.has(picked.id)) hitsA += 1
      else if (setB.has(picked.id)) hitsB += 1
    }

    assert(hitsB > 100, `对照组命中过少（${hitsB} 次），随机性异常`)
    // 理论比值约 0.06 / 1.15 ≈ 0.05，这里放宽到 0.3 仍然足以证明降权明显生效
    assert(
      hitsA < hitsB * 0.3,
      `降权未生效：今天吃过的 20 个食物共命中 ${hitsA} 次，从未吃过的 20 个共命中 ${hitsB} 次`,
    )

    return `${rounds} 次全部命中候选；今天吃过组 ${hitsA} 次 vs 从未吃过组 ${hitsB} 次`
  })

  check('13 pickFood 空数组返回 null', () => {
    assert(pickFood([], {}) === null, 'pickFood([], {}) 应返回 null')
    assert(pickFood([]) === null, 'pickFood([]) 应返回 null')
    return '空候选返回 null'
  })

  check('14 sampleFoods 抽取数量正确且不重复', () => {
    const picked = sampleFoods(FOODS, 10)
    assert(Array.isArray(picked), 'sampleFoods 未返回数组')
    assert(picked.length === 10, `期望 10 条，实际 ${picked.length} 条`)
    assert(idsOf(picked).size === 10, 'sampleFoods 结果存在重复')

    const small = FOODS.slice(0, 3)
    const allOfSmall = sampleFoods(small, 10)
    assert(allOfSmall.length === 3, `候选不足时应返回全部，实际 ${allOfSmall.length} 条`)

    return `抽 10 得 10 且不重复；候选不足时返回全部 ${allOfSmall.length} 条`
  })

  check('15 buildWheelPool 严格遵守筛选且不重复', () => {
    const scenarios = [
      { budgetKey: 'high', taste: '重口', category: '西式主菜', scene: '出去吃' },
      { budgetKey: 'cheap', taste: '辣', category: '西式主菜', scene: '食堂' },
      { budgetKey: 'cheap', taste: '清淡', category: '火锅锅物', scene: '食堂' },
      { budgetKey: 'mid', taste: '重口', category: '快餐简餐', scene: '食堂' },
      { budgetKey: 'any', taste: '随机', category: '随机', scene: '随机' },
    ]

    const notes = []
    for (const scenario of scenarios) {
      const filters = toPickerFilters(scenario)
      const pool = buildWheelPool(filters, {})
      const label = `${scenario.taste}/${scenario.category}/${scenario.scene}`
      const eligible = filterFoods(filters)
      assert(pool.length === Math.min(12, eligible.length), '转盘数量错误')
      assert(pool.every((food) => eligible.includes(food)), '转盘混入不符合条件的食物')
      assert(idsOf(pool).size === pool.length, `${label} 结果存在重复`)
      notes.push(`${label}=${pool.length}`)
    }

    return notes.join('，')
  })

  check('16 shuffle 不改原数组且元素集合一致', () => {
    const original = FOODS.slice(0, 20)
    const snapshot = original.map((food) => food.id)
    const shuffled = shuffle(original)

    assert(shuffled !== original, 'shuffle 返回了同一个数组引用')
    assert(original.map((food) => food.id).join('|') === snapshot.join('|'), 'shuffle 修改了原数组')
    assert(sameIdSet(shuffled, original), 'shuffle 结果元素集合与输入不一致')
    assert(shuffled.length === original.length, 'shuffle 改变了数组长度')

    const empty = shuffle([])
    assert(Array.isArray(empty) && empty.length === 0, 'shuffle([]) 应返回空数组')

    return `长度 ${original.length}，原数组未被修改`
  })

  check('17 新字段与独立标签有效', () => {
    for (const food of FOODS) {
      for (const [key, allowed] of [['cuisines', foodsMod.CUISINES], ['meals', foodsMod.MEALS], ['exclusions', foodsMod.EXCLUSIONS], ['uncertainExclusions', foodsMod.EXCLUSIONS]]) {
        assert(Array.isArray(food[key]) && food[key].every((tag) => allowed.includes(tag)), food.id + ' 字段无效：' + key)
        assert(new Set(food[key]).size === food[key].length, food.id + ' 重复标签')
      }
      assert(food.cuisines.length && food.meals.length, food.id + ' 缺少标签')
    }
    return '类型、地域、时段、配料字段完整'
  })

  check('18 分类语义与早餐边界', () => {
    const byName = (name) => FOODS.find((food) => food.name === name)
    for (const [name, category] of [['糯米鸡', '小吃点心'], ['牛排', '西式主菜'], ['冬阴功汤', '粥汤'], ['鸭血粉丝汤', '粉面'], ['大盘鸡', '家常菜'], ['铁锅炖鱼', '家常菜'], ['烤肉夹饼', '烧烤']]) {
      assert(byName(name)?.category === category, name + ' 分类错误')
    }
    for (const name of ['寿司', '臭豆腐', '章鱼小丸子', '咖喱鱼蛋']) assert(!byName(name).meals.includes('早餐'), name + ' 早餐过宽')
    assert(byName('糯米鸡').cuisines.includes('粤式'), '糯米鸡缺粤式')
    assert(byName('椰香咖喱鸡').cuisines.includes('东南亚'), '咖喱鸡缺风味')
    return '重点菜品归类正确'
  })

  check('19 忌口全入口复用严格排除', () => {
    for (const tag of foodsMod.EXCLUSIONS) {
      const filtered = filterFoods({ exclusions: [tag] })
      assert(filtered.length > 0 && filtered.length < FOODS.length, tag + ' 排除无效')
      for (const food of filtered) assert(pickerMod.respectsExclusions(food, [tag]), '忌口泄漏')
      assert(buildWheelPool({ exclusions: [tag] }).every((food) => filtered.includes(food)), '转盘忌口泄漏')
    }
    for (const name of ['夫妻肺片', '鸭血粉丝汤']) {
      assert(!pickerMod.respectsExclusions(FOODS.find((f) => f.name === name), ['内脏']), name + ' 漏标内脏')
    }
    assert(pickerMod.respectsExclusions(getFoodById('yuxiangrousi-fan'), ['鱼虾贝类']), '鱼香被误认为鱼肉')
    return '香菜、内脏、鱼虾贝类、辣均生效'
  })

  check('20 组合筛选及零、单、双候选', () => {
    const keys = ['category', 'taste', 'cuisine', 'meal']
    let seen = new Set()
    for (const category of CATEGORIES) for (const taste of TASTES) for (const cuisine of foodsMod.CUISINES) for (const meal of foodsMod.MEALS) {
      const filters = { category, taste, cuisine, meal }
      const eligible = filterFoods(filters)
      const pool = buildWheelPool(filters)
      if (eligible.length <= 2) { seen.add(eligible.length); assert(pool.length === eligible.length, '小候选错误') }
      assert(pool.every((food) => keys.every((key) => key === 'cuisine' ? food.cuisines.includes(cuisine) : key === 'meal' ? food.meals.includes(meal) : food[key] === filters[key])), '组合筛选泄漏')
    }
    assert([0, 1, 2].every((n) => seen.has(n)), '缺少边界场景')
    return '组合条件及 0/1/2 候选覆盖'
  })

  check('21 localStorage 兼容及忌口持久化', () => {
    const data = new Map()
    global.window = { localStorage: { getItem: (key) => data.get(key), setItem: (key, value) => data.set(key, value) } }
    try {
      data.set('tqsc:v1:favorites', JSON.stringify(['huangmenji', 'niupai']))
      data.set('tqsc:v1:history', JSON.stringify([{ id: 'huangmenji', ts: 123, category: '米饭' }]))
      storage.saveExclusions(['香菜', '内脏', '香菜', '未知'])
      assert(storage.loadExclusions().join(',') === '香菜,内脏', '忌口读写错误')
      assert(storage.loadFavorites().join(',') === 'huangmenji,niupai', '旧收藏被改动')
      assert(storage.loadHistory()[0].id === 'huangmenji', '旧历史被改动')
      data.set('tqsc:v1:exclusions', '{bad')
      assert(storage.loadExclusions().length === 0, '损坏数据未回退')
      data.set('tqsc:v1:exclusions', '{}')
      assert(storage.loadExclusions().length === 0, '非数组未回退')
      window.localStorage.getItem = () => { throw new Error('blocked') }
      window.localStorage.setItem = () => { throw new Error('blocked') }
      storage.saveExclusions(['辣'])
      assert(storage.loadExclusions().length === 0, '存储禁用未回退')
    } finally { delete global.window }
    return '旧收藏历史保留，忌口去重持久化，损坏与禁用存储降级'
  })

  /* --------------------------- 输出报告 --------------------------- */

  const groups = [
    { title: '数据完整性', from: 0, to: 6 },
    { title: '算法正确性', from: 6, to: results.length },
  ]

  console.log('')
  console.log('食物数据与推荐算法自检')
  console.log('='.repeat(64))
  console.log(`Node ${process.version}`)
  console.log(`源码 ${SRC}`)
  console.log('')

  for (const group of groups) {
    console.log(`【${group.title}】`)
    for (const item of results.slice(group.from, group.to)) {
      const tag = item.ok ? '[PASS]' : '[FAIL]'
      console.log(`  ${tag} ${padEndWidth(item.label, 34)} ${item.detail}`)
    }
    console.log('')
  }

  const passed = results.filter((item) => item.ok).length
  const failed = results.length - passed
  console.log('-'.repeat(64))
  console.log(`汇总：通过 ${passed}/${results.length}${failed ? `，失败 ${failed}` : '，全部通过'}`)
  console.log('')

  return failed === 0 ? 0 : 1
}

main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error) => {
    console.error('')
    console.error('自检脚本执行失败：')
    console.error(error && error.stack ? error.stack : String(error))
    console.error('')
    process.exitCode = 1
  })
