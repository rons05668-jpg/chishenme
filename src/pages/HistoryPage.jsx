import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { getDrinkById } from '../data/drinks'
import { getBrandById } from '../data/brands'
import { formatTime, groupHistoryByDay } from '../lib/picker'
import { useAppState } from '../state/AppState'

export default function HistoryPage() {
  const {
    history,
    removeHistoryRecord,
    clearHistory,
    toggleFavorite,
    isFavorite,
    drinkHistory,
    removeDrinkHistoryRecord,
    clearDrinkHistory,
    showToast,
  } = useAppState()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [confirmingDrink, setConfirmingDrink] = useState(false)
  const resetTimer = useRef(null)
  const resetDrinkTimer = useRef(null)

  const groups = useMemo(() => groupHistoryByDay(history), [history])

  /*
   * 饮品历史：存储层已把 name / category / ts / uid 补全，但 brandId 不在记录里，
   * 需要靠 id 回查饮品与品牌，才能显示「品牌 + 饮品名」。
   * filter(Boolean) 是硬性要求：id 可能指向已删除的饮品，getDrinkById 返回 null，
   * 不过滤会让读 brand.name 时崩页。分组逻辑与食物完全一致（都只依赖 ts）。
   */
  const drinkGroups = useMemo(
    () =>
      groupHistoryByDay(drinkHistory)
        .map((group) => ({
          day: group.day,
          label: group.label,
          items: group.items
            .map((record) => {
              const drink = getDrinkById(record.id)
              return drink ? { record, drink, brand: getBrandById(drink.brandId) } : null
            })
            .filter(Boolean),
        }))
        .filter((group) => group.items.length > 0),
    [drinkHistory]
  )

  /** 有效的饮品记录条数（排除脏数据），用于副标题与分区显隐 */
  const drinkCount = useMemo(
    () => drinkGroups.reduce((sum, group) => sum + group.items.length, 0),
    [drinkGroups]
  )

  useEffect(
    () => () => {
      clearTimeout(resetTimer.current)
      clearTimeout(resetDrinkTimer.current)
    },
    []
  )

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

  /** 清空饮品历史：一次性操作，同样需要二次确认 */
  const handleClearDrink = () => {
    if (!confirmingDrink) {
      setConfirmingDrink(true)
      clearTimeout(resetDrinkTimer.current)
      resetDrinkTimer.current = setTimeout(() => setConfirmingDrink(false), 3200)
      return
    }
    clearTimeout(resetDrinkTimer.current)
    setConfirmingDrink(false)
    clearDrinkHistory()
    showToast('饮品记录已清空', '🧹')
  }

  const handleDeleteDrink = (record) => {
    removeDrinkHistoryRecord(record.uid)
    showToast('已删除这条饮品记录', '🗑️')
  }

  /**
   * 副标题同时体现食物与饮品，两者数量独立统计：
   * 「共 N 条记录」原有的食物语义不被饮品数量污染。
   * 食物为 0 而饮品非 0 时，也会展示正确的信息而不是回退到引导语。
   */
  const subtitle = useMemo(() => {
    const parts = []
    if (history.length) parts.push(`共 ${history.length} 条记录`)
    if (drinkCount) parts.push(`${drinkCount} 条饮品记录`)
    return parts.length ? parts.join(' · ') : '记录会保存在本机'
  }, [history.length, drinkCount])

  return (
    <div className="page">
      <TopBar
        title="最近吃过"
        subtitle={subtitle}
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

      {/* 饮品记录独立分区：同样为空时整体不渲染，不干扰上方食物的空态逻辑 */}
      {drinkCount > 0 ? (
        <>
          <div className="section-title" style={{ marginTop: 18 }}>
            🧋 喝过记录
          </div>

          <button
            type="button"
            className={`btn btn--sm ${confirmingDrink ? 'btn--pink' : 'btn--ghost'}`}
            style={{ marginBottom: 6 }}
            onClick={handleClearDrink}
          >
            {confirmingDrink ? '确认清空饮品记录？' : '🧹 清空饮品记录'}
          </button>

          {drinkGroups.map((group, groupIndex) => (
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

              {group.items.map(({ record, drink, brand }) => (
                <div key={record.uid} className="record-item">
                  <span className="record-item__emoji" aria-hidden="true">
                    🥤
                  </span>
                  <div className="record-item__body">
                    <div className="record-item__name">
                      {brand ? `${brand.name} · ${drink.name}` : drink.name}
                    </div>
                    <div className="record-item__meta">
                      {formatTime(record.ts)}
                      {drink.category ? ` · ${drink.category}` : ''}
                    </div>
                  </div>
                  <div className="record-item__actions">
                    <button
                      type="button"
                      className="mini-btn mini-btn--danger"
                      aria-label={`删除 ${drink.name} 的记录`}
                      onClick={() => handleDeleteDrink(record)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </motion.section>
          ))}
        </>
      ) : null}
    </div>
  )
}
