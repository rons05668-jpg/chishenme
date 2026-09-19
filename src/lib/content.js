/**
 * 文案与选项配置
 */

import { CATEGORIES, SCENES, TASTES } from '../data/foods'

/** 首页随机副标题 */
export const TAGLINES = [
  '人生已经够难了，吃饭就别纠结了。',
  '把今天的晚饭交给命运。',
  '不知道吃什么？那就别自己决定。',
  '纠结的时间，够你吃完一碗面了。',
  '今天也是被命运投喂的一天。',
  '让转盘替你做决定，你负责吃。',
  '选择困难症的官方解决方案。',
  '别再刷外卖软件了，抽一个吧。',
]

/** 结果卡片底部的一句话 */
export const RESULT_QUOTES = [
  '今天不纠结了，就它。',
  '命运已经选好了，去吃吧。',
  '就这个了，别再想了。',
  '这顿吃它，明天的事明天再说。',
  '决定了，出发。',
  '别再刷了，就是它。',
]

/** 筛选选项：直接由数据层的枚举派生，保证与食物数据永远一致 */
export const TASTE_OPTIONS = [...TASTES, '随机']
export const CATEGORY_OPTIONS = [...CATEGORIES, '随机']
export const SCENE_OPTIONS = [...SCENES, '随机']

/** 空结果提示 */
export const EMPTY_POOL_HINT = '这个组合有点苛刻，放宽一个条件再试试。'
export const EMPTY_RESULT_HINT = '点上面的按钮，让命运替你选一个。'

/** 随机取一条文案 */
export const randomOf = (list) => list[Math.floor(Math.random() * list.length)]

/** 根据当前时段给出问候语 */
export function timeGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 5) return '夜宵时间到'
  if (hour < 10) return '早餐吃点啥'
  if (hour < 14) return '午饭吃什么'
  if (hour < 17) return '下午茶时间'
  if (hour < 21) return '晚饭吃什么'
  return '宵夜走一个'
}
