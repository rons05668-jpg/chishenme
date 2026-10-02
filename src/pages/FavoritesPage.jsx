import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BackupPanel from '../components/BackupPanel'
import FoodResultCard from '../components/FoodResultCard'
import TopBar from '../components/TopBar'
import { drinkPriceLabel, getDrinkById } from '../data/drinks'
import { getBrandById } from '../data/brands'
import { getFoodById, priceLabel } from '../data/foods'
import { pickFood, respectsExclusions } from '../lib/picker'
import { useAppState, useToastActions } from '../state/AppState'

export default function FavoritesPage() {
  const {
    favorites,
    exclusions,
    history,
    dislikes,
    toggleFavorite,
    recordEaten,
    dislikeFood,
    drinkFavorites,
    toggleDrinkFavorite,
  } = useAppState()
  const { showToast } = useToastActions()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)

  const favoriteFoods = useMemo(
    () => favorites.map(getFoodById).filter(Boolean).reverse(),
    [favorites]
  )

  /*
   * 饮品收藏：独立的存储键与 id 空间（`drink-` 前缀），与食物收藏互不污染。
   * filter(Boolean) 是硬性要求：饮品数据里可能存在已被删除的 id，
   * getDrinkById 对未知 id 返回 null，不过滤会让下面读 brand.name 时崩页。
   */
  const favoriteDrinks = useMemo(
    () => drinkFavorites
      .map((drinkId) => {
        const drink = getDrinkById(drinkId)
        return drink ? { drink, brand: getBrandById(drink.brandId) } : null
      })
      .filter(Boolean)
      .reverse(),
    [drinkFavorites]
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

  /**
   * 副标题需同时体现食物与饮品，两者数量独立统计、语义不混。
   * 没有任何收藏时保留原文案。
   */
  const subtitle = useMemo(() => {
    const parts = []
    if (favoriteFoods.length) parts.push(`已收藏 ${favoriteFoods.length} 个食物`)
    if (favoriteDrinks.length) parts.push(`${favoriteDrinks.length} 款饮品`)
    return parts.length ? parts.join(' · ') : '喜欢的先存起来'
  }, [favoriteFoods.length, favoriteDrinks.length])

  /*
   * 整页空态只在「食物与饮品都没有收藏」时出现。
   * 若仅饮品有收藏，页面顶部已显示「N 款饮品」，此时再挂一个
   * 「还没有收藏」的大空态会与副标题自相矛盾（用户会以为什么都没收藏）。
   */
  const nothingFavorited = favoriteFoods.length === 0 && favoriteDrinks.length === 0

  return (
    <div className="page">
      <TopBar title="我的收藏" subtitle={subtitle} />

      {nothingFavorited ? (
        <div className="empty">
          <span className="empty__emoji" aria-hidden="true">
            🤍
          </span>
          <span className="empty__title">还没有收藏</span>
          <span className="empty__text">
            抽到喜欢的食物或饮品时点一下「收藏」，下次就能直接从收藏里挑。
          </span>
          <button
            type="button"
            className="btn btn--primary"
            style={{ marginTop: 10 }}
            onClick={() => navigate('/random')}
          >
            <span aria-hidden="true">🎲</span> 去随机一个
          </button>
        </div>
      ) : favoriteFoods.length === 0 ? (
        <p className="tiny">还没有收藏的食物。抽到喜欢的点一下「收藏」就行。</p>
      ) : (
        <>
          <button
            type="button"
            className="btn btn--primary btn--lg btn--block"
            onClick={pickFromFavorites}
          >
            <span aria-hidden="true">🎲</span> 从收藏里随机一个
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

      {/* 饮品收藏独立分区：与食物收藏同页但互不影响，为空时整体不渲染 */}
      {favoriteDrinks.length ? (
        <>
          <div className="section-title">🧋 收藏的饮品</div>
          <div className="fav-grid">
            {favoriteDrinks.map(({ drink, brand }, index) => (
              <div key={drink.id} className="fav-item">
                <motion.button
                  type="button"
                  className="fav-card"
                  onClick={() => navigate('/drink')}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.24), duration: 0.3 }}
                >
                  <span className="fav-card__emoji" aria-hidden="true">
                    🥤
                  </span>
                  <span className="fav-card__name">
                    {brand ? `${brand.name} · ${drink.name}` : drink.name}
                  </span>
                  <span className="fav-card__meta">{drinkPriceLabel(drink)}</span>
                </motion.button>

                <button
                  type="button"
                  className="fav-card__heart"
                  aria-label={`取消收藏 ${drink.name}`}
                  onClick={() => {
                    toggleDrinkFavorite(drink.id)
                    showToast('已取消饮品收藏', '🤍')
                  }}
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* 备份面板放在页面最底部：空态与有收藏时都能看到 */}
      <BackupPanel />
    </div>
  )
}
