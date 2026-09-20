import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BackupPanel from '../components/BackupPanel'
import FoodResultCard from '../components/FoodResultCard'
import TopBar from '../components/TopBar'
import { getFoodById, priceLabel } from '../data/foods'
import { pickFood, respectsExclusions } from '../lib/picker'
import { useAppState } from '../state/AppState'

export default function FavoritesPage() {
  const {
    favorites,
    exclusions,
    history,
    dislikes,
    toggleFavorite,
    recordEaten,
    dislikeFood,
    showToast,
  } = useAppState()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)

  const favoriteFoods = useMemo(
    () => favorites.map(getFoodById).filter(Boolean).reverse(),
    [favorites]
  )

  const context = useMemo(() => ({ history, dislikes, favorites }), [history, dislikes, favorites])
  const eligibleFoods = useMemo(() => favoriteFoods.filter((food) => respectsExclusions(food, exclusions)), [favoriteFoods, exclusions])

  const pickFromFavorites = () => {
    if (!eligibleFoods.length) {
      showToast('收藏中没有符合当前忌口的食物', '🤍')
      return
    }
    const exclude = result ? [result.id] : []
    const candidates = eligibleFoods.filter((food) => !exclude.includes(food.id))
    setResult(pickFood(candidates.length ? candidates : eligibleFoods, context))
  }

  const handleEat = (food) => {
    recordEaten(food)
    showToast(`已记录：${food.name}`, '✅')
  }

  const handleDislike = (food) => {
    dislikeFood(food.id)
    showToast('已减少它的出现概率', '🙅')
    const rest = eligibleFoods.filter((item) => item.id !== food.id)
    setResult(rest.length ? pickFood(rest, context) : null)
  }

  return (
    <div className="page">
      <TopBar
        title="我的收藏"
        subtitle={favoriteFoods.length ? `已收藏 ${favoriteFoods.length} 个` : '喜欢的先存起来'}
      />

      {favoriteFoods.length === 0 ? (
        <div className="empty">
          <span className="empty__emoji" aria-hidden="true">
            🤍
          </span>
          <span className="empty__title">还没有收藏</span>
          <span className="empty__text">
            抽到喜欢的食物时点一下「收藏」，下次就能直接从收藏里挑。
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
        <>
          <button
            type="button"
            className="btn btn--primary btn--lg btn--block"
            onClick={pickFromFavorites}
          >
            🎲 从收藏里随机一个
          </button>

          {exclusions.length > 0 ? <p className="tiny">按已保存忌口筛选：{eligibleFoods.length} 个可选，收藏记录均保留。</p> : null}
          {result && respectsExclusions(result, exclusions) ? (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <FoodResultCard
                food={result}
                onEat={handleEat}
                onReroll={pickFromFavorites}
                onDislike={handleDislike}
              />
            </motion.div>
          ) : null}

          <div className="section-title" style={{ marginTop: 4 }}>
            ❤️ 收藏列表
          </div>

          <div className="fav-grid">
            {favoriteFoods.map((food, index) => (
              <div key={food.id} className="fav-item">
                <motion.button
                  type="button"
                  className="fav-card"
                  onClick={() => respectsExclusions(food, exclusions) ? setResult(food) : showToast('这道食物与当前忌口冲突，请先调整忌口', '🤔')}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.3 }}
                >
                  <span className="fav-card__emoji" aria-hidden="true">
                    {food.emoji}
                  </span>
                  <span className="fav-card__name">{food.name}</span>
                  <span className="fav-card__meta">
                    {priceLabel(food)} · {food.category}
                  </span>
                </motion.button>

                <button
                  type="button"
                  className="fav-card__heart"
                  aria-label={`取消收藏 ${food.name}`}
                  onClick={() => {
                    toggleFavorite(food.id)
                    showToast('已取消收藏', '🤍')
                    if (result?.id === food.id) setResult(null)
                  }}
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 备份面板放在页面最底部：空态与有收藏时都能看到 */}
      <BackupPanel />
    </div>
  )
}
