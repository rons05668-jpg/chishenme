import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { formatTime, groupHistoryByDay } from '../lib/picker'
import { useAppState } from '../state/AppState'

export default function HistoryPage() {
  const { history, removeHistoryRecord, clearHistory, toggleFavorite, isFavorite, showToast } =
    useAppState()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const resetTimer = useRef(null)

  const groups = useMemo(() => groupHistoryByDay(history), [history])

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const handleClear = () => {
    if (!confirming) {
      setConfirming(true)
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setConfirming(false), 3200)
      return
    }
    clearTimeout(resetTimer.current)
    setConfirming(false)
    clearHistory()
    showToast('记录已清空', '🧹')
  }

  const handleDelete = (record) => {
    removeHistoryRecord(record.uid)
    showToast('已删除这条记录', '🗑️')
  }

  return (
    <div className="page">
      <TopBar
        title="最近吃过"
        subtitle={history.length ? `共 ${history.length} 条记录` : '记录会保存在本机'}
        right={
          history.length ? (
            <button
              type="button"
              className={`btn btn--sm ${confirming ? 'btn--pink' : 'btn--ghost'}`}
              onClick={handleClear}
            >
              {confirming ? '确认清空？' : '清空'}
            </button>
          ) : null
        }
      />

      {history.length === 0 ? (
        <div className="empty">
          <span className="empty__emoji" aria-hidden="true">
            🍽️
          </span>
          <span className="empty__title">还没有吃过记录</span>
          <span className="empty__text">
            每次点「就吃这个」，这里就会自动记下吃了什么、什么时候吃的。
          </span>
          <button
            type="button"
            className="btn btn--primary"
            style={{ marginTop: 10 }}
            onClick={() => navigate('/random')}
          >
            🎲 去随机一个
          </button>
        </div>
      ) : (
        groups.map((group, groupIndex) => (
          <motion.section
            key={group.day.getTime()}
            className="history-group"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(groupIndex * 0.05, 0.2), duration: 0.32 }}
          >
            <div className="history-group__label">
              <span>{group.label}</span>
              <span className="tiny">{group.items.length} 次</span>
            </div>

            {group.items.map((record) => (
              <div key={record.uid} className="record-item">
                <span className="record-item__emoji" aria-hidden="true">
                  {record.emoji}
                </span>
                <div className="record-item__body">
                  <div className="record-item__name">{record.name}</div>
                  <div className="record-item__meta">
                    {formatTime(record.ts)}
                    {record.category ? ` · ${record.category}` : ''}
                    {record.taste ? ` · ${record.taste}` : ''}
                  </div>
                </div>
                <div className="record-item__actions">
                  <button
                    type="button"
                    className="mini-btn"
                    aria-label={`${isFavorite(record.id) ? '取消收藏' : '收藏'} ${record.name}`}
                    onClick={() => {
                      const added = toggleFavorite(record.id)
                      showToast(added ? '已加入收藏' : '已取消收藏', added ? '❤️' : '🤍')
                    }}
                  >
                    {isFavorite(record.id) ? '❤️' : '🤍'}
                  </button>
                  <button
                    type="button"
                    className="mini-btn mini-btn--danger"
                    aria-label={`删除 ${record.name} 的记录`}
                    onClick={() => handleDelete(record)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </motion.section>
        ))
      )}
    </div>
  )
}
