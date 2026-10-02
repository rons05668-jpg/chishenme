import { useEffect, useState } from 'react'
import { applyPwaUpdate, getPwaUpdateEpoch, subscribePwaUpdate } from '../lib/pwaUpdate'

/** 「稍后」时记下的更新批次号：存 localStorage，刷新后依然有效 */
const DISMISSED_KEY = 'tqsc:v1:updateDismissedEpoch'

const readDismissedEpoch = () => {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY)
    const epoch = Number(raw)
    return Number.isFinite(epoch) ? epoch : 0
  } catch {
    return 0
  }
}

/**
 * 新版本更新提示条
 * ------------------------------------------------------------------
 * 只在「检测到 waiting 中的新 Service Worker」时出现，由用户点击后才刷新。
 * 刷新只做页面重载：收藏 / 历史 / 忌口 / 筛选偏好都在 localStorage 中，不受影响。
 * 点「稍后」会把当前更新批次号记下来，刷新后不再打扰；但下一次真的有新版本
 * （批次号更大）时，横幅会重新出现。
 */
export default function UpdateBanner() {
  const [ready, setReady] = useState(false)
  const [dismissedEpoch, setDismissedEpoch] = useState(readDismissedEpoch)
  const [applying, setApplying] = useState(false)

  useEffect(() => subscribePwaUpdate(setReady), [])

  const epoch = getPwaUpdateEpoch()
  if (!ready || epoch <= dismissedEpoch) return null

  const handleApply = () => {
    setApplying(true)
    // 应用后新 SW 接管会触发页面重载；返回 false 说明 worker 已丢失，收回提示条
    if (!applyPwaUpdate()) {
      setApplying(false)
      setReady(false)
    }
  }

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISSED_KEY, String(epoch))
    } catch {
      /* 存储不可用时退化为本次会话有效 */
    }
    setDismissedEpoch(epoch)
  }

  return (
    <div className="update-banner" role="status" aria-live="polite">
      <span className="update-banner__text">
        <span aria-hidden="true">✨</span>
        有新版本可用，刷新后生效（你的收藏和历史不会丢失）
      </span>
      <span className="update-banner__actions">
        <button
          type="button"
          className="btn btn--sm btn--primary"
          onClick={handleApply}
          disabled={applying}
        >
          {applying ? '正在刷新…' : '立即刷新'}
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={handleDismiss}>
          稍后
        </button>
      </span>
    </div>
  )
}
