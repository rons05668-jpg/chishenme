import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { priceLabel } from '../data/foods'
import { RESULT_QUOTES, randomOf } from '../lib/content'
import { useAppState } from '../state/AppState'

/**
 * 推荐结果大卡片
 * 抽到食物后展示：emoji、名称、价格、类型口味、一句话文案，以及四个操作。
 */
export default function FoodResultCard({
  food,
  onEat,
  onReroll,
  onDislike,
  rerollLabel = '🎲 再来一次',
  showFavorite = true,
  eatLabel = '✅ 就吃这个',
  eyebrow = null,
}) {
  const { isFavorite, toggleFavorite, showToast } = useAppState()
  const [quote, setQuote] = useState(() => randomOf(RESULT_QUOTES))
  const [eaten, setEaten] = useState(false)
  const [heartBeat, setHeartBeat] = useState(0)

  const favorite = isFavorite(food.id)

  // 每次换食物都刷新一句文案，并重置「已记录」状态
  useEffect(() => {
    setQuote(randomOf(RESULT_QUOTES))
    setEaten(false)
  }, [food.id])

  const handleFavorite = () => {
    const added = toggleFavorite(food.id)
    setHeartBeat((n) => n + 1)
    showToast(added ? '已加入收藏' : '已取消收藏', added ? '❤️' : '🤍')
  }

  const handleEat = () => {
    if (eaten) return
    setEaten(true)
    onEat?.(food)
  }

  return (
    <motion.section
      className="result-card"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {eyebrow ? <p className="result-card__eyebrow">{eyebrow}</p> : null}

      <motion.div
        key={food.id}
        className="result-card__emoji"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        aria-hidden="true"
      >
        {food.emoji}
      </motion.div>

      <h2 className="result-card__name">{food.name}</h2>
      <div className="result-card__price">{priceLabel(food)}</div>

      <div className="result-card__tags">
        <span className="chip chip--primary">{food.category}</span>
        <span className="chip chip--accent">{food.taste}</span>
        {food.scenes.map((scene) => (
          <span key={scene} className="chip">
            {scene}
          </span>
        ))}
      </div>

      <p className="result-card__desc">{food.desc}</p>
      <p className="result-card__quote">「{quote}」</p>

      <div className="stack" style={{ marginTop: 18 }}>
        <div className="result-actions result-actions--main">
          <button
            type="button"
            className={`btn btn--lg ${eaten ? 'btn--mint' : 'btn--primary'}`}
            onClick={handleEat}
          >
            {eaten ? '已记录到最近吃过' : eatLabel}
          </button>
        </div>

        <div className="result-actions">
          <button type="button" className="btn btn--soft" onClick={() => onReroll?.()}>
            {rerollLabel}
          </button>

          {showFavorite ? (
            <button
              type="button"
              className={`btn ${favorite ? 'btn--pink' : 'btn--ghost'}`}
              onClick={handleFavorite}
            >
              <span key={heartBeat} className={heartBeat ? 'heart-pop' : ''} aria-hidden="true">
                {favorite ? '❤️' : '🤍'}
              </span>
              {favorite ? '已收藏' : '收藏'}
            </button>
          ) : (
            <button type="button" className="btn btn--ghost" onClick={() => onDislike?.(food)}>
              🙅 这个不要
            </button>
          )}
        </div>

        {showFavorite ? (
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => onDislike?.(food)}
          >
            🙅 这个不要，换一个
          </button>
        ) : null}
      </div>
    </motion.section>
  )
}
