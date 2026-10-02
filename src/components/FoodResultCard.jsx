import { priceLabel } from '../data/foods'
import { RESULT_QUOTES } from '../lib/content'
import { useAppState } from '../state/AppState'
import ResultCard from './ResultCard'

/**
 * 推荐结果大卡片（食物）
 * 结构与交互收敛到 ResultCard，这里只注入食物特有的字段
 * （价格、类型/口味/场景 chips）。
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
  const { isFavorite, toggleFavorite } = useAppState()

  return (
    <ResultCard
      item={food}
      emoji={food.emoji}
      eyebrow={eyebrow}
      price={priceLabel(food)}
      tags={
        <>
          <span className="chip chip--primary">{food.category}</span>
          <span className="chip chip--accent">{food.taste}</span>
          {(food.scenes || []).map((scene) => (
            <span key={scene} className="chip">
              {scene}
            </span>
          ))}
        </>
      }
      desc={food.desc}
      quotes={RESULT_QUOTES}
      onEat={onEat}
      onReroll={onReroll}
      onDislike={onDislike}
      rerollLabel={rerollLabel}
      eatLabel={eatLabel}
      eatenActiveLabel="已记录到最近吃过"
      showFavorite={showFavorite}
      isFavorite={isFavorite}
      toggleFavorite={toggleFavorite}
    />
  )
}
