import { useEffect, useState } from 'react'
import { applyPwaUpdate, subscribePwaUpdate } from '../lib/pwaUpdate'

/**
 * 新版本更新提示条
 * ------------------------------------------------------------------
 * 只在「检测到 waiting 中的新 Service Worker」时出现，由用户点击后才刷新。
 * 刷新只做页面重载：收藏 / 历史 / 忌口 / 筛选偏好都在 localStorage 中，不受影响。
 */
export default function UpdateBanner() {
  const [ready, setReady] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => subscribePwaUpdate(setReady), [])

  if (!ready || dismissed) return null

  const handleApply = () => {
    setApplying(true)
    // 应用后新 SW 接管会触发页面重载；返回 false 说明 worker 已丢失，收回提示条
    if (!applyPwaUpdate()) {
      setApplying(false)
      setReady(false)
    }
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
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => setDismissed(true)}
        >
          稍后
        </button>
      </span>
    </div>
  )
}
