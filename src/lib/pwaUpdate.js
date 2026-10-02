/**
 * PWA 更新状态广播
 * Service Worker 的注册与事件监听放在 main.jsx，这里只维护「是否有新版本待更新」的状态，
 * 让任意组件都能订阅到并自行渲染提示条，避免把 UI 逻辑写进入口文件。
 */

let waitingWorker = null
let updateReady = false
/**
 * 更新批次号：每次发现新版本 +1。
 * UpdateBanner 把用户点「稍后」时的批次号存进 localStorage，
 * 下一次发现更新（批次号更大）时横幅会重新出现，而不是永久沉默。
 */
let updateEpoch = 0
/** 是否由用户主动确认更新：只有这种情况才允许页面重载 */
let userApproved = false
const listeners = new Set()

/** 通知所有订阅者当前是否有新版本待更新 */
function publish() {
  listeners.forEach((listener) => listener(updateReady))
}

/** 订阅更新状态，返回取消订阅函数（挂载时会立刻同步一次当前状态） */
export function subscribePwaUpdate(callback) {
  listeners.add(callback)
  callback(updateReady)
  return () => {
    listeners.delete(callback)
  }
}

/** 标记发现新版本（同一个 waiting worker 的重复标记不算新版本） */
export function markPwaUpdateReady(worker) {
  const next = worker || waitingWorker
  if (updateReady && next === waitingWorker) return
  if (next && next !== waitingWorker) updateEpoch += 1
  waitingWorker = next
  if (!updateReady) {
    updateReady = true
    if (updateEpoch === 0) updateEpoch += 1
  }
  publish()
}

/** 当前更新批次号（见顶部注释） */
export function getPwaUpdateEpoch() {
  return updateEpoch
}

/** 判断当前是否有新版本待更新 */
export function isPwaUpdateReady() {
  return updateReady
}

/**
 * 是否应该因为 SW 接管而重载页面。
 * ------------------------------------------------------------------
 * 首次安装时 navigator.serviceWorker.controller 从无到有也会触发 controllerchange，
 * 若不加区分地 reload，用户第一次打开页面就会被无故刷新一次。
 * 只有「发现新版本 + 用户点了立即刷新」才允许重载。
 */
export function shouldReloadOnControllerChange() {
  return userApproved
}

/**
 * 用户确认更新：让 waiting 中的新 SW 立即接管。
 * 新 SW 接管后页面会收到 controllerchange，由 main.jsx 触发一次重载。
 * 只涉及 SW 与页面重载，不触碰任何 localStorage 数据。
 */
export function applyPwaUpdate() {
  if (!waitingWorker) return false
  try {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  } catch {
    // worker 已终止或 postMessage 失败：不能把 userApproved 置 true，
    // 否则之后任何 controllerchange 都会触发无意义的重载。
    waitingWorker = null
    return false
  }
  userApproved = true
  waitingWorker = null
  updateReady = false
  publish()
  return true
}
