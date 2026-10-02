import { drinkEmoji } from '../data/drinks-meta'
import { drinkPriceLabel } from '../data/drinks'
import { getBrandById } from '../data/brands'
import { RESULT_QUOTES, DRINK_QUOTES } from '../lib/content'
import { useAppState } from '../state/AppState'
import ResultCard from './ResultCard'

/** 在售状态为「常驻」以外时，给出明确的限定提示文案 */
const AVAILABILITY_NOTES = {
  seasonal: '季节限定，非全年供应',
  regional: '区域限定，部分城市可能没有',
  unknown: '在售状态待确认',
  discontinued: '已下架',
}

/**
 * 饮品推荐结果大卡片
 * 结构与交互收敛到 ResultCard，这里只注入饮品特有的字段
 * （品牌行、冷热/甜度/咖啡因/类型/场景 chips、在售状态提示）。
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
  const { isDrinkFavorite, toggleDrinkFavorite } = useAppState()
  const brand = getBrandById(drink.brandId)
  const availabilityNote = AVAILABILITY_NOTES[drink.availability] || null
  const quotes = DRINK_QUOTES.length ? DRINK_QUOTES : RESULT_QUOTES

  return (
    <ResultCard
      item={drink}
      emoji={drinkEmoji(drink)}
      header={brand ? <p className="result-card__brand">{brand.name}</p> : null}
      eyebrow={brand ? null : eyebrow}
      price={drinkPriceLabel(drink)}
      tags={
        <>
          <span className="chip chip--primary">{drink.category}</span>
          {/*
            甜度：数据字段是 sweetness（数组，来自官方公示的可选糖度）。
            官方未公示时为空数组，此时不渲染任何 chip——不用默认值冒充。
          */}
          {(drink.sweetness || []).map((level) => (
            <span key={level} className="chip chip--accent">
              {level}
            </span>
          ))}
          <span className="chip">{drink.caffeine}</span>
          {(drink.temperatures || []).map((temperature) => (
            <span key={temperature} className="chip">
              {temperature}
            </span>
          ))}
          {(drink.scenes || []).map((scene) => (
            <span key={scene} className="chip">
              {scene}
            </span>
          ))}
          {(drink.ingredientTags || []).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </>
      }
      notice={
        availabilityNote ? (
          <p className="pool-hint pool-hint--inline">
            <span aria-hidden="true">⚠️</span>
            <span>{availabilityNote}</span>
          </p>
        ) : null
      }
      desc={drink.desc}
      quotes={quotes}
      onEat={onEat}
      onReroll={onReroll}
      onDislike={onDislike}
      rerollLabel={rerollLabel}
      eatLabel={eatLabel}
      eatenActiveLabel="已记录到最近喝过"
      showFavorite={showFavorite}
      isFavorite={isDrinkFavorite}
      toggleFavorite={toggleDrinkFavorite}
    />
  )
}
