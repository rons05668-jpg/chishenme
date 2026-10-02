import { useState } from 'react'
import { motion } from 'framer-motion'
import { randomOf } from '../lib/content'
import { useToastActions } from '../state/AppState'

/**
 * 开头的 emoji 簇（可能带 VS16 / ZWJ 连接）。
 * 按钮文案里常把 emoji 写进 label 字符串（如 '🎲 再来一次'），
 * 这里拆出来包一层 aria-hidden，避免读屏把 emoji 名读出来造成噪音。
 */
const EMOJI_LEAD = /^(\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)/u

export function renderLabel(label) {
  if (typeof label !== 'string') return label
  const match = label.match(EMOJI_LEAD)
  if (!match) return label
  return (
    <>
      <span aria-hidden="true">{match[1]}</span>
      {label.slice(match[1].length)}
    </>
  )
}

/**
 * 推荐结果大卡片（食物 / 饮品共用）。
 * ------------------------------------------------------------------
 * 以前 FoodResultCard 与 DrinkResultCard 两套实现逐行重复
 * （动画参数、结构、按钮组几乎一致），现在收敛到这一个组件，
 * 差异全部由 props 注入：
 *  - item            条目对象（至少有 id）
 *  - emoji           顶部大 emoji（食物直接取 food.emoji，饮品用 drinkEmoji 派生）
 *  - header          品牌行等顶部信息（饮品用；食物传 null）
 *  - eyebrow         眉题（如「🎉 转盘结果」）
 *  - price           价格行节点
 *  - tags            标签 chips 节点
 *  - notice          额外提示节点（如饮品的在售状态说明）
 *  - desc            一句话描述
 *  - quotes          文案池，换条目时随机取一句
 *  - onEat / onReroll / onDislike
 *  - rerollLabel / eatLabel / eatenActiveLabel（记录成功后的主按钮文案）
 *  - showFavorite / isFavorite / toggleFavorite
 */
export default function ResultCard({
  item,
  emoji,
  header = null,
  eyebrow = null,
  price,
  tags,
  notice = null,
  desc,
  quotes,
  onEat,
  onReroll,
  onDislike,
  rerollLabel = '🎲 再来一次',
  eatLabel = '✅ 就吃这个',
  eatenActiveLabel = '已记录',
  showFavorite = true,
  isFavorite = () => false,
  toggleFavorite = () => false,
}) {
  return (
    <motion.section
      className="result-card"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {/* key 换条目时重置内部状态（文案 / 已记录 / 心跳动画），
          替代原来 useEffect 里 setQuote + setEaten 的派生状态重置写法 */}
      <ResultCardBody
        key={item.id}
        item={item}
        emoji={emoji}
        header={header}
        eyebrow={eyebrow}
        price={price}
        tags={tags}
        notice={notice}
        desc={desc}
        quotes={quotes}
        onEat={onEat}
        onReroll={onReroll}
        onDislike={onDislike}
        rerollLabel={rerollLabel}
        eatLabel={eatLabel}
        eatenActiveLabel={eatenActiveLabel}
        showFavorite={showFavorite}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
    </motion.section>
  )
}

function ResultCardBody({
  item,
  emoji,
  header,
  eyebrow,
  price,
  tags,
  notice,
  desc,
  quotes,
  onEat,
  onReroll,
  onDislike,
  rerollLabel,
  eatLabel,
  eatenActiveLabel,
  showFavorite,
  isFavorite,
  toggleFavorite,
}) {
  const { showToast } = useToastActions()
  const [quote] = useState(() => randomOf(quotes))
  const [eaten, setEaten] = useState(false)
  const [heartBeat, setHeartBeat] = useState(0)

  const favorite = isFavorite(item.id)

  const handleFavorite = () => {
    const added = toggleFavorite(item.id)
    setHeartBeat((n) => n + 1)
    showToast(added ? '已加入收藏' : '已取消收藏', added ? '❤️' : '🤍')
  }

  const handleEat = () => {
    if (eaten) return
    setEaten(true)
    onEat?.(item)
  }

  return (
    <>
      {header}
      {eyebrow ? <p className="result-card__eyebrow">{eyebrow}</p> : null}

      <motion.div
        key={item.id}
        className="result-card__emoji"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        aria-hidden="true"
      >
        {emoji}
      </motion.div>

      <h2 className="result-card__name">{item.name}</h2>
      <div className="result-card__price">{price}</div>

      <div className="result-card__tags">{tags}</div>

      {notice}

      <p className="result-card__desc">{desc}</p>
      <p className="result-card__quote">「{quote}」</p>

      <div className="stack" style={{ marginTop: 18 }}>
        <div className="result-actions result-actions--main">
          <button
            type="button"
            className={`btn btn--lg ${eaten ? 'btn--mint' : 'btn--primary'}`}
            onClick={handleEat}
          >
            {eaten ? eatenActiveLabel : renderLabel(eatLabel)}
          </button>
        </div>

        <div className="result-actions">
          <button type="button" className="btn btn--soft" onClick={() => onReroll?.()}>
            {renderLabel(rerollLabel)}
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
            <button type="button" className="btn btn--ghost" onClick={() => onDislike?.(item)}>
              <span aria-hidden="true">🙅</span> 这个不要
            </button>
          )}
        </div>

        {showFavorite ? (
          <button type="button" className="btn btn--quiet" onClick={() => onDislike?.(item)}>
            <span aria-hidden="true">🙅</span> 这个不要，换一个
          </button>
        ) : null}
      </div>
    </>
  )
}
