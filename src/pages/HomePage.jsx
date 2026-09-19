import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TAGLINES, randomOf, timeGreeting } from '../lib/content'
import { formatTime } from '../lib/picker'
import { useAppState } from '../state/AppState'

export default function HomePage() {
  const { history, favorites, stats } = useAppState()
  const navigate = useNavigate()
  const [tagline] = useState(() => randomOf(TAGLINES))

  const last = history[0]

  return (
    <div className="page">
      <section className="hero">
        <span className="hero__bowl" aria-hidden="true">
          🍜
        </span>
        <div className="hero__greeting">
          <span aria-hidden="true">🕒</span>
          {timeGreeting()}
        </div>
        <h1 className="hero__title">
          今天<em>吃什么</em>？
        </h1>
        <p className="hero__tagline">{tagline}</p>

        <div className="hero__stats">
          <div className="stat-pill">
            <div className="stat-pill__value">{stats.totalDecided || 0}</div>
            <div className="stat-pill__label">已决定顿数</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill__value">{history.length}</div>
            <div className="stat-pill__label">最近吃过</div>
          </div>
          <div className="stat-pill">
            <div className="stat-pill__value">{favorites.length}</div>
            <div className="stat-pill__label">收藏</div>
          </div>
        </div>
      </section>

      <section className="mode-grid">
        <motion.button
          type="button"
          className="mode-card mode-card--random"
          onClick={() => navigate('/random')}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}
        >
          <span className="mode-card__icon" aria-hidden="true">
            🎲
          </span>
          <span className="mode-card__body">
            <span className="mode-card__title">随机吃什么</span>
            <span className="mode-card__desc">选好预算和口味，让命运帮你选一个</span>
          </span>
          <span className="mode-card__arrow" aria-hidden="true">
            →
          </span>
        </motion.button>

        <motion.button
          type="button"
          className="mode-card mode-card--wheel"
          onClick={() => navigate('/wheel')}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}
        >
          <span className="mode-card__icon" aria-hidden="true">
            🎡
          </span>
          <span className="mode-card__body">
            <span className="mode-card__title">转一下</span>
            <span className="mode-card__desc">转盘决定，转到什么就吃什么</span>
          </span>
          <span className="mode-card__arrow" aria-hidden="true">
            →
          </span>
        </motion.button>
      </section>

      {last ? (
        <section className="last-decision animate-rise">
          <span className="last-decision__emoji" aria-hidden="true">
            {last.emoji}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tiny">上一次决定的是</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{last.name}</div>
          </div>
          <span className="chip">{formatTime(last.ts)}</span>
        </section>
      ) : null}

      <section className="quick-row">
        <button type="button" className="quick-card" onClick={() => navigate('/history')}>
          <span className="quick-card__top">
            <span className="quick-card__emoji" aria-hidden="true">
              🕘
            </span>
            最近吃过
          </span>
          <span className="quick-card__meta">
            {history.length ? `共 ${history.length} 条记录` : '还没有记录'}
          </span>
        </button>

        <button type="button" className="quick-card" onClick={() => navigate('/favorites')}>
          <span className="quick-card__top">
            <span className="quick-card__emoji" aria-hidden="true">
              ❤️
            </span>
            我的收藏
          </span>
          <span className="quick-card__meta">
            {favorites.length ? `已收藏 ${favorites.length} 个` : '还没有收藏'}
          </span>
        </button>
      </section>

      <p className="tiny" style={{ textAlign: 'center', marginTop: 4 }}>
        所有记录都只保存在你自己的浏览器里 · 支持添加到手机主屏
      </p>
    </div>
  )
}
