import { useRef, useState } from 'react'
import { BACKUP_FORMAT_VERSION, MAX_BACKUP_BYTES } from '../lib/storage'
import { useAppState, useToastActions } from '../state/AppState'

/**
 * 本地数据备份面板
 * ------------------------------------------------------------------
 * 数据全部存在本机 localStorage，换设备 / 清缓存就会丢，
 * 因此提供一个「导出 json / 导入 json」的兜底手段。
 *
 * 职责划分：本组件只负责交互与结果展示，真正的读写与校验
 * 全部交给 AppState 的 exportBackup / importBackup，避免两处逻辑不一致。
 */

/** 备份文件体积上限，用于提示文案 */
const MAX_KB = Math.round(MAX_BACKUP_BYTES / 1024)

export default function BackupPanel() {
  const { exportBackup, importBackup, history, favorites, exclusions } = useAppState()
  const { showToast } = useToastActions()
  const fileInputRef = useRef(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)

  // 防御：并行改动期间这两个方法可能还没挂到 context 上
  const canExport = typeof exportBackup === 'function'
  const canImport = typeof importBackup === 'function'
  const supported = canExport && canImport

  const counts = [
    { key: 'history', emoji: '🕘', label: '历史', value: history.length },
    { key: 'favorites', emoji: '❤️', label: '收藏', value: favorites.length },
    { key: 'exclusions', emoji: '🚫', label: '忌口', value: exclusions.length },
  ]

  const handleExport = () => {
    if (!canExport) return
    const res = exportBackup()
    if (res && res.ok) {
      showToast('备份文件已导出', '💾')
      setResult({ type: 'success', title: '导出成功', lines: [res.message || '备份文件已保存到下载目录'] })
      return
    }
    const message = (res && res.message) || '导出失败，请稍后重试'
    showToast(message, '😵')
    setResult({ type: 'error', title: '导出失败', lines: [message] })
  }

  const handlePickFile = () => {
    if (!canImport || importing) return
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files && event.target.files[0]
    // 用户取消选择：什么都不做
    if (!file) return

    setImporting(true)
    setResult(null)

    try {
      let text = ''
      try {
        text = await file.text()
      } catch {
        // 文件被占用 / 权限不足 / 读取中断
        throw new Error('读取文件失败，请确认文件未被占用后重试')
      }

      const res = importBackup(text)

      // importBackup 未实现或返回异常结构时，兜底成失败态而不是白屏
      if (!res || typeof res !== 'object') {
        setResult({ type: 'error', title: '导入失败', lines: ['导入功能暂时不可用，请稍后重试'] })
        showToast('导入功能暂时不可用', '😵')
        return
      }

      if (res.ok) {
        const added = res.added || {}
        setResult({
          type: 'success',
          title: '导入完成',
          lines: [
            `新增 历史 ${added.history || 0} 条 / 收藏 ${added.favorites || 0} 个 / 忌口 ${added.exclusions || 0} 项`,
            `新增 饮料历史 ${added.drinkHistory || 0} 条 / 饮料收藏 ${added.drinkFavorites || 0} 个 / 饮料忌口 ${added.drinkExclusions || 0} 项`,
            ...(res.warnings || []),
          ],
        })
        showToast('备份已合并导入', '📥')
      } else {
        const message = res.message || '导入失败，文件可能已损坏'
        setResult({ type: 'error', title: '导入失败', lines: [message] })
        showToast(message, '😵')
      }
    } catch (error) {
      const message = error?.message || '导入过程中出现异常，请重试'
      setResult({ type: 'error', title: '导入失败', lines: [message] })
      showToast(message, '😵')
    } finally {
      setImporting(false)
      // 重置 value，保证同一个文件可以连续导入两次都能触发 change
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <section className="card card--tint backup" aria-labelledby="backup-title">
      <div className="backup__head">
        <span className="backup__emoji" aria-hidden="true">
          💾
        </span>
        <div style={{ minWidth: 0 }}>
          <h2 className="section-title" id="backup-title">
            本地数据备份
          </h2>
          <p className="tiny">数据只存在这台设备的浏览器里，导出后可换设备恢复。</p>
        </div>
      </div>

      <ul className="backup__stats">
        {counts.map((item) => (
          <li key={item.key} className="backup__stat">
            <span className="backup__stat-emoji" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="backup__stat-value">{item.value}</span>
            <span className="backup__stat-label">{item.label}</span>
          </li>
        ))}
      </ul>

      {!supported ? (
        <p className="tiny">当前版本暂不支持数据备份，请更新到最新版本后再试。</p>
      ) : null}

      <div className="backup__actions">
        <button
          type="button"
          className="btn btn--primary btn--sm btn--block"
          onClick={handleExport}
          disabled={!canExport}
        >
          <span aria-hidden="true">💾</span> 导出备份
        </button>

        <button
          type="button"
          className="btn btn--ghost btn--sm btn--block"
          onClick={handlePickFile}
          disabled={!canImport || importing}
        >
          {importing ? (<><span aria-hidden="true">⏳</span> 正在导入…</>) : (<><span aria-hidden="true">📥</span> 选择备份文件导入</>)}
        </button>

        {/* 原生 input 会被隐藏，用上面的 label 式按钮触发，保证外观统一 */}
        <input
          ref={fileInputRef}
          id="backup-file"
          className="backup__file"
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          disabled={!canImport || importing}
          aria-label="选择备份文件"
        />
      </div>

      <p className="tiny">
        导出内容包含收藏、历史、忌口和筛选偏好，文件带格式版本号（v{BACKUP_FORMAT_VERSION}）；
        单个文件不超过 {MAX_KB} KB。
      </p>
      <p className="tiny">导入只做合并去重，不会删除你已有的任何数据。</p>

      {result ? (
        <div
          className={`backup__result ${result.type === 'error' ? 'is-error' : 'is-success'}`}
          role="status"
          aria-live="polite"
        >
          <div className="backup__result-title">
            <span aria-hidden="true">{result.type === 'error' ? '⚠️' : '✅'}</span>
            <span>{result.title}</span>
          </div>
          <ul className="backup__result-list">
            {result.lines.filter(Boolean).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="tiny" role="status" aria-live="polite">
          还没有进行过导入操作。
        </p>
      )}
    </section>
  )
}
