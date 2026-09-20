import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { drinkEmoji, drinkPriceLabel } from '../data/drinks'
import { getBrandById } from '../data/brands'
import { RESULT_QUOTES, DRINK_QUOTES, randomOf } from '../lib/content'
import { useAppState } from '../state/AppState'

/** 在售状态为「常驻」以外时，给出明确的限定提示文案 */
const AVAILABILITY_NOTES = {
  seasonal: '季节限定，非全年供应',
  regional: '区域限定，部分城市可能没有',
  unknown: '在售状态待确认',
  discontinued: '已下架',
}

/**
 * 饮品推荐结果大卡片
 * 结构与 FoodResultCard 保持一致，只把食物特有的字段（口味/场景）
 * 换成饮品维度（品牌 / 冷热 / 甜度 / 咖啡因 / 类型 / 场景）。
 *
 * 诚实性约定：
 *  - 价格一律标注为参考价（第三方来源由 drinkPriceLabel 标「第三方参考」）
 *  - 不使用「实时价格」「实时库存」等表述
 *  - 区域 / 季节限定、在售状态待确认会显式提示
 *
 * 注：底部「菜单与价格以门店为准（参考价来源：…）」整段提示已于 2026-09-20
 * 按用户要求移除。价格来源仍保留在数据层（drink.priceNote / priceSource），
 * 需要时可重新渲染，不要在数据里删。
 */
export default function DrinkResultCard({
  drink,
  onEat,
  onReroll,
  onDislike,
  rerollLabel = '🎲 再来一次',
  showFavorite = true,
  eatLabel = '✅ 就喝这个',
  eyebrow = null,
}) {
  const { isDrinkFavorite, toggleDrinkFavorite, showToast } = useAppState()
  const [quote, setQuote] = useState(() => randomOf(DRINK_QUOTES.length ? DRINK_QUOTES : RESULT_QUOTES))
  const [eaten, setEaten] = useState(false)
  const [heartBeat, setHeartBeat] = useState(0)

  const favorite = isDrinkFavorite(drink.id)
  const brand = getBrandById(drink.brandId)
  const availabilityNote = AVAILABILITY_NOTES[drink.availability] || null

  useEffect(() => {
    setQuote(randomOf(DRINK_QUOTES.length ? DRINK_QUOTES : RESULT_QUOTES))
    setEaten(false)
  }, [drink.id])

  const handleFavorite = () => {
    const added = toggleDrinkFavorite(drink.id)
    setHeartBeat((n) => n + 1)
    showToast(added ? '已加入收藏' : '已取消收藏', added ? '❤️' : '🤍')
  }

  const handleEat = () => {
    if (eaten) return
    setEaten(true)
    onEat?.(drink)
  }

  return (
    <motion.section
      className="result-card"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {brand ? (
        <p className="result-card__brand">{brand.name}</p>
      ) : eyebrow ? (
        <p className="result-card__eyebrow">{eyebrow}</p>
      ) : null}

      <motion.div
        key={drink.id}
        className="result-card__emoji"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        aria-hidden="true"
      >
        {drinkEmoji(drink)}
      </motion.div>

      <h2 className="result-card__name">{drink.name}</h2>
      <div className="result-card__price">{drinkPriceLabel(drink)}</div>

      <div className="result-card__tags">
        <span className="chip chip--primary">{drink.category}</span>
        {/*
          甜度：数据字段是 sweetness（数组，来自官方公示的可选糖度）。
          官方未公示时为空数组，此时不渲染任何 chip——不用默认值冒充。
        */}
        {drink.sweetness.map((level) => (
          <span key={level} className="chip chip--accent">
            {level}
          </span>
        ))}
        <span className="chip">{drink.caffeine}</span>
        {drink.temperatures.map((temperature) => (
          <span key={temperature} className="chip">
            {temperature}
          </span>
        ))}
        {drink.scenes.map((scene) => (
          <span key={scene} className="chip">
            {scene}
          </span>
        ))}
        {drink.ingredientTags?.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>

      {availabilityNote ? (
        <p className="pool-hint pool-hint--inline">
          <span aria-hidden="true">⚠️</span>
          <span>{availabilityNote}</span>
        </p>
      ) : null}

      <p className="result-card__desc">{drink.desc}</p>
      <p className="result-card__quote">「{quote}」</p>

      <div className="stack" style={{ marginTop: 18 }}>
        <div className="result-actions result-actions--main">
          <button
            type="button"
            className={`btn btn--lg ${eaten ? 'btn--mint' : 'btn--primary'}`}
            onClick={handleEat}
          >
            {eaten ? '已记录到最近喝过' : eatLabel}
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
            <button type="button" className="btn btn--ghost" onClick={() => onDislike?.(drink)}>
              🙅 这个不要
            </button>
          )}
        </div>

        {showFavorite ? (
          <button type="button" className="btn btn--quiet" onClick={() => onDislike?.(drink)}>
            🙅 这个不要，换一个
          </button>
        ) : null}
      </div>
    </motion.section>
  )
}
