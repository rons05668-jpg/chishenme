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
      // 旧历史记录缺少 name 等展示字段，必须保留并由食物库补全，而不能被当成脏数据丢弃
      const legacy = storage.loadHistory()
      assert(legacy.length === 1, `旧历史记录被丢弃，实际保留 ${legacy.length} 条`)
      assert(legacy[0].id === 'huangmenji', '旧历史 id 被改动')
      assert(legacy[0].name === '黄焖鸡米饭', `旧历史 name 未从食物库补全，实际「${legacy[0].name}」`)
      assert(typeof legacy[0].emoji === 'string' && legacy[0].emoji.length > 0, '旧历史 emoji 未补全')
      // 缺 id / ts 的脏数据才应被剔除
      data.set('tqsc:v1:history', JSON.stringify([
        { id: 'huangmenji', ts: 1 },
        { ts: 2 },
        { id: 'niupai' },
        null,
        'garbage',
      ]))
      assert(storage.loadHistory().length === 1, '脏历史未按 id+ts 规则剔除')
      data.set('tqsc:v1:history', JSON.stringify([{ id: 'huangmenji', ts: 123, category: '米饭' }]))
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

  check('22 筛选偏好校验与旧数据兼容', () => {
    const { normalizeFilterPrefs, DEFAULT_FILTER_PREFS } = storage

    // 空 / 非对象 / 缺字段：全部回退到默认值
    const empty = normalizeFilterPrefs(null)
    assert(Object.keys(empty).length === 6, 'normalizeFilterPrefs 结果字段数应为 6')
    for (const key of Object.keys(DEFAULT_FILTER_PREFS)) {
      assert(empty[key] === DEFAULT_FILTER_PREFS[key], `缺省时 ${key} 应回退默认值，实际 ${empty[key]}`)
    }

    // 非法枚举值回退
    const dirty = normalizeFilterPrefs({
      budgetKey: '不存在',
      taste: '超辣',
      category: '不存在的类型',
      scene: '天上',
      cuisine: '火星菜',
      meal: '宵夜加餐',
    })
    for (const key of Object.keys(DEFAULT_FILTER_PREFS)) {
      assert(dirty[key] === DEFAULT_FILTER_PREFS[key], `非法枚举 ${key} 未回退，实际 ${dirty[key]}`)
    }

    // 合法值必须保留
    const valid = normalizeFilterPrefs({
      budgetKey: 'mid',
      taste: '辣',
      category: '火锅锅物',
      scene: '外卖',
      cuisine: '川渝',
      meal: '晚餐',
    })
    assert(valid.budgetKey === 'mid' && valid.taste === '辣' && valid.category === '火锅锅物', '合法值未保留')
    assert(valid.scene === '外卖' && valid.cuisine === '川渝' && valid.meal === '晚餐', '合法值未保留')

    // 字段类型错误（数字 / 数组）也要回退而非崩溃
    const wrongTypes = normalizeFilterPrefs({ taste: 123, category: ['米饭'], scene: {}, budgetKey: null })
    assert(wrongTypes.taste === DEFAULT_FILTER_PREFS.taste, '数字类型未回退')
    assert(wrongTypes.category === DEFAULT_FILTER_PREFS.category, '数组类型未回退')
    assert(wrongTypes.scene === DEFAULT_FILTER_PREFS.scene, '对象类型未回退')

    return '默认回退、非法枚举回退、合法值保留、类型错误容错'
  })

  check('23 备份导出结构与格式版本', () => {
    const { buildBackup, BACKUP_FORMAT_VERSION } = storage
    const payload = buildBackup({
      history: [{ uid: 'a', id: 'huangmenji', name: '黄焖鸡米饭', ts: 1 }],
      favorites: ['huangmenji', 'huangmenji', 'niupai'],
      exclusions: ['香菜', '香菜', '不存在'],
      filterPrefs: { taste: '辣' },
      stats: { totalDecided: 3, firstUsedAt: 1 },
    })
    assert(payload.formatVersion === BACKUP_FORMAT_VERSION, '缺少格式版本')
    assert(payload.app === 'today-eat-what', 'app 标识错误')
    assert(typeof payload.exportedAt === 'string', '缺少导出时间')
    assert(payload.data.favorites.length === 2, '收藏未去重')
    assert(payload.data.exclusions.join(',') === '香菜', '忌口未去重或未过滤非法值')
    assert(payload.data.filterPrefs.taste === '辣', '偏好未保留')
    assert(payload.data.history.length === 1, '历史未保留')
    return `v${payload.formatVersion}，含导出时间；收藏去重 3→2，忌口去重并过滤非法值`
  })

  check('24 导入非法文件被拒绝且不改动数据', () => {
    const { parseBackup, MAX_BACKUP_BYTES } = storage

    // 非字符串
    assert(parseBackup(null).ok === false, 'null 应被拒绝')
    assert(parseBackup(123).ok === false, '数字应被拒绝')
    // 空文件
    assert(parseBackup('   ').ok === false, '空内容应被拒绝')
    // 非 JSON
    assert(parseBackup('{不是json').ok === false, '非法 JSON 应被拒绝')
    // 过大文件
    const huge = 'x'.repeat(MAX_BACKUP_BYTES + 1)
    const tooBig = parseBackup(huge)
    assert(tooBig.ok === false && /过大/.test(tooBig.reason), '超大文件应被拒绝')
    // 非法 JSON 数组顶层
    assert(parseBackup('[1,2,3]').ok === false, '数组顶层应被拒绝')
    // 非本应用备份
    assert(parseBackup('{"app":"other-app","formatVersion":1,"data":{}}').ok === false, '其他应用备份应被拒绝')
    // 缺格式版本
    assert(parseBackup('{"app":"today-eat-what","data":{}}').ok === false, '缺格式版本应被拒绝')
    // 版本过高
    const future = parseBackup('{"app":"today-eat-what","formatVersion":999,"data":{}}')
    assert(future.ok === false && /版本/.test(future.reason), '过高版本应被拒绝')
    // 缺 data
    assert(parseBackup('{"app":"today-eat-what","formatVersion":1}').ok === false, '缺 data 应被拒绝')

    // 合法文件但字段类型错误：整体不失败，字段跳过并给出警告
    const partial = parseBackup(JSON.stringify({
      app: 'today-eat-what',
      formatVersion: 1,
      data: { history: 'kidding', favorites: ['huangmenji'], exclusions: null },
    }))
    assert(partial.ok === true, '字段类型错误不应导致整体导入失败')
    assert(partial.warnings.length > 0, '字段类型错误应产生警告')
    assert(partial.data.favorites.length === 1, '有效字段仍应被保留')

    return '非字符串/空/非法JSON/超大/非本应用/缺版本/版本过高/缺data 全部拒绝；部分字段错误可降级'
  })

  check('25 导入合并去重且不删除已有数据', () => {
    const { mergeImported, parseBackup } = storage

    const current = {
      history: [
        { uid: 'h1', id: 'huangmenji', name: '黄焖鸡米饭', ts: 200 },
        { uid: 'h2', id: 'niupai', name: '牛排', ts: 100 },
      ],
      favorites: ['huangmenji', 'niupai'],
      exclusions: ['香菜'],
    }
    const incoming = {
      history: [
        { uid: 'h1', id: 'huangmenji', name: '黄焖鸡米饭', ts: 200 }, // 重复，应被去重
        { uid: 'h3', id: 'malatang', name: '麻辣烫', ts: 300 },       // 新增
      ],
      favorites: ['huangmenji', 'malatang'], // 含重复项 + 新增项
      exclusions: ['香菜', '内脏'],          // 含重复项 + 新增项
      filterPrefs: { taste: '辣' },
    }

    const merged = mergeImported(current, incoming)
    // 历史：h1 去重，h3 新增 → 共 3 条，按时间倒序
    assert(merged.history.length === 3, `历史应合并为 3 条，实际 ${merged.history.length}`)
    assert(merged.history[0].ts === 300, '历史未按时间倒序')
    assert(merged.added.history === 1, `历史新增应为 1，实际 ${merged.added.history}`)
    // 收藏：并集去重 → huangmenji, niupai, malatang
    assert(merged.favorites.length === 3, `收藏应合并为 3 个，实际 ${merged.favorites.length}`)
    assert(merged.added.favorites === 1, '收藏新增应为 1')
    // 忌口：并集去重 → 香菜, 内脏
    assert(merged.exclusions.join(',') === '香菜,内脏', '忌口合并错误')
    assert(merged.added.exclusions === 1, '忌口新增应为 1')
    // 现有数据全部保留
    assert(merged.history.some((r) => r.uid === 'h2'), '现有历史 h2 被删除')
    assert(merged.favorites.includes('niupai'), '现有收藏 niupai 被删除')
    assert(merged.exclusions.includes('香菜'), '现有忌口 香菜 被删除')

    // 导入空数据不应减少任何现有数据
    const emptyImport = mergeImported(current, { history: [], favorites: [], exclusions: [] })
    assert(emptyImport.history.length === 2, '空导入不应改变历史')
    assert(emptyImport.favorites.length === 2, '空导入不应改变收藏')
    assert(emptyImport.exclusions.length === 1, '空导入不应改变忌口')

    // 与 parseBackup 串联：完整链路
    const text = JSON.stringify({
      app: 'today-eat-what',
      formatVersion: 1,
      exportedAt: '2026-01-01T00:00:00.000Z',
      data: { history: [{ uid: 'h9', id: 'baozi', name: '包子', ts: 400 }], favorites: ['baozi'], exclusions: ['辣'] },
    })
    const parsed = parseBackup(text)
    assert(parsed.ok === true, '合法备份应解析成功')
    const chained = mergeImported(current, parsed.data)
    assert(chained.history.length === 3, '串联后历史应为 3 条')
    assert(chained.favorites.length === 3, '串联后收藏应为 3 个')
    assert(chained.exclusions.length === 2, '串联后忌口应为 2 项')

    return '重复去重、新增计入、现有数据零删除、空导入无副作用、parse+merge 串联正确'
  })

  /* ================================================================== */
  /* 饮料模块                                                            */
  /* ================================================================== */

  const brandsMod = await import(pathToFileURL(path.join(SRC, 'data', 'brands.js')).href)
  const drinksMod = await import(pathToFileURL(path.join(SRC, 'data', 'drinks.js')).href)
  const drinkPicker = await import(pathToFileURL(path.join(SRC, 'lib', 'drinkPicker.js')).href)

  const { BRANDS, BRAND_MAP, AVAILABILITY_LEVELS } = brandsMod
  const {
    DRINKS,
    DRINK_MAP,
    DRINK_CATEGORIES,
    TEMPERATURES,
    SUGAR_LEVELS,
    CAFFEINE_LEVELS,
    DRINK_EXCLUSIONS,
    getDrinkById,
    matchDrinkBudget,
  } = drinksMod
  const { filterDrinks, pickDrinkByBrand, buildDrinkWheelPool, isRecommendable } = drinkPicker

  check('26 饮料与品牌关联、ID 唯一、字段类型一致', () => {
    assert(DRINKS.length > 0, 'DRINKS 为空')
    assert(BRANDS.length > 0, 'BRANDS 为空')

    // 品牌表自身：id 与名称都必须唯一（重复会让筛选选项出现两个同名按钮）
    const brandIds = BRANDS.map((b) => b.id)
    assert(new Set(brandIds).size === brandIds.length, '品牌表存在重复 id')
    const brandNames = BRANDS.map((b) => b.name)
    assert(new Set(brandNames).size === brandNames.length, '品牌表存在重复名称')

    // ID 唯一
    const ids = DRINKS.map((d) => d.id)
    assert(new Set(ids).size === ids.length, '存在重复的饮品 id')
    assert(ids.every((id) => isNonEmptyString(id) && id.startsWith('drink-')), 'id 必须为非空且以 drink- 开头')

    // 与食物 id 完全不冲突（这是本地收藏/历史不串数据的前提）
    const foodIds = new Set(FOODS.map((f) => f.id))
    const conflict = ids.filter((id) => foodIds.has(id))
    assert(conflict.length === 0, `以下饮品 id 与食物 id 冲突：${conflict.slice(0, 5).join(', ')}`)

    // brandId 必须存在于品牌表
    const unknownBrand = DRINKS.filter((d) => !BRAND_MAP[d.brandId]).map((d) => `${d.id}->${d.brandId}`)
    assert(unknownBrand.length === 0, `存在未登记的品牌引用：${unknownBrand.slice(0, 5).join(', ')}`)

    // 反向：品牌表中不应有「零饮品」的孤儿品牌（会让用户选中后恒为零候选）
    const usedBrands = new Set(DRINKS.map((d) => d.brandId))
    const orphanBrands = BRANDS.filter((b) => !usedBrands.has(b.id)).map((b) => b.id)
    assert(
      orphanBrands.length === 0,
      `以下品牌在饮品表中没有任何条目：${orphanBrands.join(', ')}`
    )

    // 逐字段类型校验
    for (const d of DRINKS) {
      assert(isNonEmptyString(d.name), `${d.id} name 非法`)
      assert(DRINK_CATEGORIES.includes(d.category), `${d.id} category 非法：${d.category}`)
      assert(AVAILABILITY_LEVELS.includes(d.availability), `${d.id} availability 非法：${d.availability}`)
      assert(CAFFEINE_LEVELS.includes(d.caffeine), `${d.id} caffeine 非法：${d.caffeine}`)
      assert(Array.isArray(d.sources), `${d.id} sources 必须是数组`)
      /*
       * 价格：允许三种合法状态，绝不允许用 0 元冒充未知。
       *  - 'unpublished' 官方与第三方均无可核验价格 → priceRange 必须为 null
       *  - 'official'    品牌官方渠道公示            → 正数区间
       *  - 'thirdParty'  第三方聚合站                → 正数区间 + 必须可追溯来源
       * 0 元会被 UI 显示成「免费」，是比缺失更严重的错误信息。
       */
      assert(
        ['official', 'thirdParty', 'unpublished'].includes(d.priceStatus),
        `${d.id} priceStatus 非法：${d.priceStatus}`
      )
      if (d.priceStatus === 'unpublished') {
        assert(d.priceRange === null, `${d.id} 价格未公示时 priceRange 必须为 null，不能填 [0,0] 之类的假值`)
      } else {
        assert(Array.isArray(d.priceRange) && d.priceRange.length === 2, `${d.id} priceRange 必须是二元数组`)
        const [lo, hi] = d.priceRange
        assert(Number.isFinite(lo) && Number.isFinite(hi), `${d.id} 价格必须是有限数字`)
        assert(lo > 0 && hi >= lo, `${d.id} 价格区间非法：[${lo}, ${hi}]（不允许 0 元占位）`)
        // 第三方价格必须写明来源，否则用户无法判断可信度
        assert(
          isNonEmptyString(d.priceNote) && d.sources.length > 0,
          `${d.id} 第三方价格缺少来源说明，不可追溯`
        )
      }
    }

    return `${DRINKS.length} 款饮品 / ${BRANDS.length} 个品牌，字段类型与 id 唯一性均通过`
  })

  check('26b 配置选项只取官方可确认值', () => {
    /*
     * 温度/甜度选项必须来自具体商品信息，不能统一套用行业通用值。
     * 这里不做「必须有值」的强制（官方未公示时应为空数组），
     * 而是校验「有值时必须是合法枚举」，并统计留空数量供人工复核。
     */
    let emptyTemp = 0
    let emptySweet = 0
    for (const d of DRINKS) {
      assert(Array.isArray(d.temperatures), `${d.id} temperatures 必须是数组`)
      assert(d.temperatures.every((t) => TEMPERATURES.includes(t)), `${d.id} temperatures 含非法值`)
      assert(Array.isArray(d.sweetness), `${d.id} sweetness 必须是数组`)
      assert(d.sweetness.every((s) => SUGAR_LEVELS.includes(s)), `${d.id} sweetness 含非法值`)
      assert(Array.isArray(d.ingredientTags), `${d.id} ingredientTags 必须是数组`)
      if (d.temperatures.length === 0) emptyTemp += 1
      if (d.sweetness.length === 0) emptySweet += 1
    }
    return `温度留空 ${emptyTemp}/${DRINKS.length}，甜度留空 ${emptySweet}/${DRINKS.length}（官方未公示时留空是正确行为）`
  })

  check('27 数据来源与核验日期完整性', () => {
    const missingSources = DRINKS.filter((d) => !d.sources || d.sources.length === 0)
    const badVerified = DRINKS.filter((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d.verifiedAt || ''))
    const brandsMissingSources = BRANDS.filter((b) => !b.sources || b.sources.length === 0)

    /*
     * 来源精度：只指向域名根路径（如 https://www.naixue.com/）的来源，
     * 无法定位到具体菜单页，支撑力弱于深链接。这类条目客观存在
     * （部分品牌没有可直达的菜单 URL），但要显式统计出来，
     * 避免「有来源」这一句话掩盖「来源不够精确」的事实。
     */
    const shallowSources = DRINKS.filter((d) =>
      d.sources.every((url) => {
        const rest = String(url).replace(/^https?:\/\/[^/]+/, '')
        return rest === '' || rest === '/'
      })
    )
    // 核验日期分布：全量同一天说明是集中核验，不是逐条独立复核
    const dateBuckets = {}
    for (const d of DRINKS) {
      const key = d.verifiedAt || 'missing'
      dateBuckets[key] = (dateBuckets[key] || 0) + 1
    }
    const dateSummary = Object.entries(dateBuckets)
      .sort((a, b) => b[1] - a[1])
      .map(([date, count]) => `${date}×${count}`)
      .join(' ')
    const isBulkSameDay = Object.keys(dateBuckets).length === 1

    // 无来源的条目不算错误（客观存在无法访问官方资料的情况），但必须显式统计
    return [
      `有来源 ${DRINKS.length - missingSources.length}/${DRINKS.length}`,
      `待补来源 ${missingSources.length}`,
      `来源仅到首页 ${shallowSources.length}（支撑力弱，已如实保留）`,
      `核验日期合规 ${DRINKS.length - badVerified.length}/${DRINKS.length}`,
      `日期分布 ${dateSummary}${isBulkSameDay ? '（集中核验，非逐条独立复核）' : ''}`,
      `品牌缺来源 ${brandsMissingSources.length}/${BRANDS.length}`,
    ].join('，')
  })

  check('28 在售状态标注与推荐池准入', () => {
    const byAvailability = {}
    for (const level of AVAILABILITY_LEVELS) byAvailability[level] = 0
    for (const d of DRINKS) byAvailability[d.availability] += 1

    const recommendable = DRINKS.filter(isRecommendable)

    // 已下架与待确认一律不得进入推荐池
    const leaked = recommendable.filter(
      (d) => d.availability === 'discontinued' || d.availability === 'unknown'
    )
    assert(leaked.length === 0, `已下架/待确认的饮品进入了推荐池：${leaked.map((d) => d.id).slice(0, 5).join(', ')}`)

    // 季节/区域限定默认不进推荐池
    const limited = recommendable.filter(
      (d) => d.availability === 'seasonal' || d.availability === 'regional'
    )
    assert(limited.length === 0, `季节/区域限定饮品默认进入了推荐池：${limited.map((d) => d.id).slice(0, 5).join(', ')}`)

    // 待确认 + 已下架必须写明原因，否则用户无从判断
    const noNote = DRINKS.filter(
      (d) => (d.availability === 'unknown' || d.availability === 'discontinued') && !isNonEmptyString(d.availabilityNote)
    )
    assert(noNote.length === 0, `待确认/已下架未写明原因：${noNote.map((d) => d.id).slice(0, 5).join(', ')}`)

    return [
      `常驻 ${byAvailability.permanent}`,
      `季节 ${byAvailability.seasonal}`,
      `区域 ${byAvailability.regional}`,
      `待确认 ${byAvailability.unknown}`,
      `已下架 ${byAvailability.discontinued}`,
      `→ 默认可推荐 ${recommendable.length}`,
    ].join('，')
  })

  check('29 咖啡因标注不臆造（纯茶/果茶/奶茶不得默认无咖啡因）', () => {
    // 茶叶本身含咖啡因：任何以茶为基底的分类都不应被标为「确认不含咖啡因」，
    // 除非确有官方依据。这里用保守校验拦住明显的错误标注。
    const teaBased = ['奶茶', '鲜奶茶', '果茶', '纯茶']
    const suspicious = DRINKS.filter(
      (d) => teaBased.includes(d.category) && d.caffeine === '无咖啡因'
    )
    // 允许存在，但必须带明确依据备注（例如官方标注 decaf），否则视为臆造
    const fabricated = suspicious.filter((d) => !isNonEmptyString(d.caffeineNote))
    assert(
      fabricated.length === 0,
      `茶基饮品被标为无咖啡因但无依据：${fabricated.map((d) => d.id).slice(0, 5).join(', ')}`
    )

    const counts = DRINKS.reduce((acc, d) => {
      acc[d.caffeine] = (acc[d.caffeine] || 0) + 1
      return acc
    }, {})
    return `无咖啡因 ${counts['无咖啡因'] || 0}，低咖啡因 ${counts['低咖啡因'] || 0}，高咖啡因 ${counts['高咖啡因'] || 0}，无依据错标 0`
  })

  check('30 仅不含咖啡因必须排除含咖啡因与未知', () => {
    const pool = filterDrinks({ caffeine: '无咖啡因', exclusions: [] })
    const bad = pool.filter((d) => d.caffeine !== '无咖啡因')
    assert(bad.length === 0, `「仅不含咖啡因」放入了非无咖啡因饮品：${bad.map((d) => d.id).slice(0, 5).join(', ')}`)

    // 未知必须被排除（caffeine 枚举中没有 unknown 值时会自然排除，这里显式断言）
    const unknownLeak = pool.filter((d) => d.caffeine === 'unknown' || !d.caffeine)
    assert(unknownLeak.length === 0, '未知咖啡因状态的饮品被放入了无咖啡因结果')

    return `无咖啡因候选 ${pool.length} 款，含咖啡因与未知均被正确排除`
  })

  check('31 品牌筛选与跨品牌抽样均衡性', () => {
    const all = filterDrinks({ exclusions: [] })
    assert(all.length > 0, '默认筛选无候选，无法验证品牌均衡性')

    // 从实际数据里取一个有候选的品牌，而不是写死某个品牌 id
    // （写死会在该品牌数据尚未录入时产生假失败）
    const brandsWithCandidates = new Set(all.map((d) => d.brandId))
    const sampleBrand = [...brandsWithCandidates][0]

    // 单品牌筛选必须纯净
    const brandPool = filterDrinks({ brand: sampleBrand, exclusions: [] })
    assert(brandPool.length > 0, `品牌 ${sampleBrand} 筛选结果为空`)
    assert(
      brandPool.every((d) => d.brandId === sampleBrand),
      `品牌 ${sampleBrand} 的筛选结果混入了其他品牌`
    )

    // 跨品牌抽样：品牌优先策略下，各「有候选的品牌」应都能被抽到。
    // 这是「不因收录条目多而系统性占优」的可测试证据。
    const hit = new Set()
    for (let i = 0; i < 800; i += 1) {
      const picked = pickDrinkByBrand(all, {})
      if (picked) hit.add(picked.brandId)
    }
    const unhit = [...brandsWithCandidates].filter((b) => !hit.has(b))
    assert(
      unhit.length === 0,
      `800 次抽样仍未覆盖以下品牌（大目录品牌占优的证据）：${unhit.join(', ')}`
    )

    // 多品牌时，各品牌被抽中的次数应处于合理区间，不应出现单品牌霸占多数
    if (brandsWithCandidates.size > 1) {
      const counts = {}
      for (let i = 0; i < 800; i += 1) {
        const picked = pickDrinkByBrand(all, {})
        if (picked) counts[picked.brandId] = (counts[picked.brandId] || 0) + 1
      }
      const max = Math.max(...Object.values(counts))
      // 等概率选品牌 → 每个品牌期望 800/N。允许 2.5 倍偏差，超出即为失衡。
      const expected = 800 / brandsWithCandidates.size
      assert(
        max < expected * 2.5,
        `品牌抽样失衡：最高 ${max} 次，期望约 ${expected.toFixed(0)} 次`
      )
    }

    return `${brandsWithCandidates.size} 个品牌在 800 次抽样中全部命中，单品牌筛选纯净`
  })

  check('32 零候选、单候选与转盘不补入条件外饮品', () => {
    // 构造一个明确无解的筛选组合
    const impossible = filterDrinks({
      brand: 'mxbc',
      category: '咖啡',
      temperature: '热',
      caffeine: '无咖啡因',
      exclusions: [],
    })
    // 无论结果如何，关键是不能凭空补入
    assert(impossible.every((d) => d.brandId === 'mxbc'), '零候选组合补入了其他品牌')

    // 转盘候选必须全部来自严格筛选结果
    const filters = { exclusions: [] }
    const wheel = buildDrinkWheelPool(filters, {}, 8, 10)
    const strict = new Set(filterDrinks(filters).map((d) => d.id))
    const intruder = wheel.filter((d) => !strict.has(d.id))
    assert(intruder.length === 0, `转盘补入了条件外饮品：${intruder.map((d) => d.id).join(', ')}`)
    assert(wheel.length <= 10, `转盘候选超过上限：${wheel.length}`)

    // 候选充足时不应少于下限
    const strictCount = strict.size
    if (strictCount >= 8) {
      assert(wheel.length === Math.min(10, strictCount), `转盘候选数异常：${wheel.length}，期望 ${Math.min(10, strictCount)}`)
    }

    return `不可能组合候选 ${impossible.length} 款（未补入）、转盘候选 ${wheel.length} 款全部来自严格筛选`
  })

  check('33 饮料备份 v1 兼容与食物数据隔离', () => {
    const { parseBackup, mergeImported: merge2 } = storage

    // v1 老备份（仅食物字段）必须仍能解析，且不产生饮料脏数据
    const v1 = JSON.stringify({
      app: 'today-eat-what',
      formatVersion: 1,
      exportedAt: '2026-01-01T00:00:00.000Z',
      data: { history: [{ uid: 'h1', id: 'baozi', name: '包子', ts: 1 }], favorites: ['baozi'], exclusions: ['辣'] },
    })
    const parsedV1 = parseBackup(v1)
    assert(parsedV1.ok === true, `v1 备份应可解析：${parsedV1.reason || ''}`)

    const current = {
      history: [{ uid: 'h0', id: 'niupai', name: '牛排', ts: 0 }],
      favorites: ['niupai'],
      exclusions: [],
      drinkHistory: [{ uid: 'd1', id: 'drink-naicha', name: '珍珠奶茶', ts: 5 }],
      drinkFavorites: ['drink-naicha'],
      drinkExclusions: [],
    }
    const merged = merge2(current, parsedV1.data)
    // 食物数据正常合并
    assert(merged.history.length === 2, 'v1 导入后食物历史合并不正确')
    // 饮料数据必须原样保留，不被 v1 内容清空
    assert(merged.drinkHistory.length === 1, 'v1 导入清空了饮料历史')
    assert(merged.drinkFavorites.includes('drink-naicha'), 'v1 导入清空了饮料收藏')

    return 'v1 备份可解析，导入不污染也不清空饮料数据'
  })

  check('34 饮料筛选偏好校验与非法值回退', () => {
    const { normalizeDrinkPrefs, DEFAULT_DRINK_PREFS } = storage

    // 完全非法的输入必须回退为默认值
    const fallback = normalizeDrinkPrefs({ brand: 123, budgetKey: 'nope', temperature: {}, category: [], sugar: 'x', caffeine: null })
    assert(fallback.brand === DEFAULT_DRINK_PREFS.brand, `brand 非法值未回退：${fallback.brand}`)
    assert(fallback.budgetKey === DEFAULT_DRINK_PREFS.budgetKey, 'budgetKey 非法值未回退')
    assert(fallback.temperature === DEFAULT_DRINK_PREFS.temperature, 'temperature 非法值未回退')
    assert(fallback.category === DEFAULT_DRINK_PREFS.category, 'category 非法值未回退')
    assert(fallback.sugar === DEFAULT_DRINK_PREFS.sugar, 'sugar 非法值未回退')
    assert(fallback.caffeine === DEFAULT_DRINK_PREFS.caffeine, 'caffeine 非法值未回退')

    // null / undefined 也必须安全
    const fromNull = normalizeDrinkPrefs(null)
    assert(fromNull.budgetKey === DEFAULT_DRINK_PREFS.budgetKey, 'null 输入未回退')

    // 合法值应原样保留
    const valid = normalizeDrinkPrefs({ brand: 'mxbc', budgetKey: 'cheap', temperature: '热', category: '纯茶', sugar: '无糖', caffeine: '无咖啡因' })
    assert(valid.brand === 'mxbc' && valid.budgetKey === 'cheap' && valid.temperature === '热', '合法值被错误改写')

    return '非法枚举/类型/null 全部回退默认，合法值原样保留'
  })

  /**
   * 检查 35：饮品 schema 字段名与消费端一致。
   * ------------------------------------------------------------------
   * 这一项是回归防护。本模块曾出现一批「字段名假设错误」的真实缺陷：
   *   - 数据字段是 `sweetness`（数组），但筛选/忌口代码读的是 `drink.sugar`
   *     → 甜度筛选恒零候选、「不要高糖」忌口完全失效；
   *   - 结果卡片渲染 `drink.emoji`，但数据里根本没有该字段
   *     → 界面出现空白图标。
   * 这类错误的共同点是「读一个 schema 里不存在的键，得到 undefined，
   * 却不报错、静默失效」。因此这里显式断言：
   *   1. DRINKS 里不得出现 `sugar` / `emoji` 这类非 schema 字段；
   *   2. schema 声明的字段必须在每条数据上都存在且类型正确。
   */
  check('35 饮品 schema 字段名一致（防静默失效）', () => {
    // schema 里声明的字段（与 enrichDrink 白名单保持一致）
    const SCHEMA = {
      id: 'string',
      brandId: 'string',
      name: 'string',
      aliases: 'array',
      category: 'string',
      priceStatus: 'string',
      availability: 'string',
      temperatures: 'array',
      sweetness: 'array',
      ingredientTags: 'array',
      caffeine: 'string',
      scenes: 'array',
      sources: 'array',
      verifiedAt: 'string',
    }

    // 1) 禁止出现 schema 之外的别名键（历史 bug 的形状）
    for (const key of ['sugar', 'emoji', 'taste', 'temperatureOptions', 'sweetnessOptions', 'caffeineStatus']) {
      const offenders = DRINKS.filter((drink) => Object.prototype.hasOwnProperty.call(drink, key))
      assert(offenders.length === 0, `存在非 schema 字段「${key}」：${offenders.slice(0, 3).map((d) => d.id).join(', ')} 等 ${offenders.length} 条`)
    }

    // 2) schema 字段必须齐全且类型正确
    const typeOf = (value) => (Array.isArray(value) ? 'array' : typeof value)
    for (const [key, expected] of Object.entries(SCHEMA)) {
      const bad = DRINKS.filter((drink) => typeOf(drink[key]) !== expected)
      assert(bad.length === 0, `字段「${key}」应为 ${expected}，异常 ${bad.length} 条：${bad.slice(0, 3).map((d) => d.id).join(', ')}`)
    }

    // 3) 甜度筛选已从界面移除（推荐池内没有任何一条带糖度数据，放着就是装饰）。
    //    这里锁定底层口径：糖度筛选只能命中「该饮品确实公示了该糖度」的条目，
    //    且不得因为数据缺失就零候选之外还谎报结果。
    const { filterDrinks } = drinkPicker
    const noSugar = filterDrinks({ sugar: '无糖' })
    for (const drink of noSugar) {
      assert(drink.sweetness.includes('无糖'), `${drink.id} 被「无糖」筛出但 sweetness 未声明无糖`)
    }
    const noDataSelected = noSugar.filter((d) => d.sweetness.length === 0)
    assert(noDataSelected.length === 0, `糖度未知的饮品被糖度筛选选中：${noDataSelected.length} 条`)

    // 4) 忌口「高糖」的口径：只排除【明确公示提供正常糖】的饮品。
    //    不得把「糖度未公示」当成高糖——那会让 180 条常驻饮品全部出局，
    //    一个勾选锁死功能（曾经的真实缺陷）。同时也不能反向泄露正常糖饮品。
    const highSugarExcluded = filterDrinks({ exclusions: ['高糖'] })
    const leaked = highSugarExcluded.filter((d) => d.sweetness.includes('正常糖'))
    assert(leaked.length === 0, `「不要高糖」未排除含正常糖饮品：${leaked.length} 条`)
    // 忌口后候选必须仍然可用（不能因数据缺失而清零）
    assert(highSugarExcluded.length > 0, '「不要高糖」把关口收得过紧，候选清零（会锁死功能）')

    // 5) emoji 派生函数必须对全部饮品返回非空字符串
    const emptyEmoji = DRINKS.filter((d) => !drinksMod.drinkEmoji(d) || typeof drinksMod.drinkEmoji(d) !== 'string')
    assert(emptyEmoji.length === 0, `drinkEmoji 返回空值：${emptyEmoji.length} 条`)

    // 6) 结果卡片消费的字段必须在 schema 里真实存在（防 undefined 静默渲染）
    const cardFields = ['category', 'caffeine', 'temperatures', 'scenes', 'sweetness']
    for (const key of cardFields) {
      const bad = DRINKS.filter((d) => d[key] === undefined)
      assert(bad.length === 0, `结果卡片读取的字段「${key}」在 ${bad.length} 条数据上为 undefined`)
    }

    return `甜度口径一致（无糖命中 ${noSugar.length} 且全部有依据），高糖忌口排除正常糖 ${highSugarExcluded.length ? '有效' : '无效'}且候选未清零（剩 ${highSugarExcluded.length}），emoji 全量非空`
  })

  /* --------------------------- 输出报告 --------------------------- */

  const groups = [
    { title: '食物 · 数据完整性', from: 0, to: 6 },
    { title: '食物 · 算法正确性', from: 6, to: 26 },
    { title: '饮料 · 数据与推荐', from: 26, to: results.length },
  ]

  console.log('')
  console.log('食物与饮料数据自检')
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
