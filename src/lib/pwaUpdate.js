/**
 * PWA 更新状态广播
 * Service Worker 的注册与事件监听放在 main.jsx，这里只维护「是否有新版本待更新」的状态，
 * 让任意组件都能订阅到并自行渲染提示条，避免把 UI 逻辑写进入口文件。
 */

let waitingWorker = null
let updateReady = false
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

/** 标记发现新版本（重复调用不会重复通知） */
export function markPwaUpdateReady(worker) {
  waitingWorker = worker || waitingWorker
  if (updateReady) return
  updateReady = true
  publish()
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
  userApproved = true
  waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  waitingWorker = null
  updateReady = false
  publish()
  return true
}
