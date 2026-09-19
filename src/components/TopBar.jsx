import { useLocation, useNavigate } from 'react-router-dom'

/** 子页面顶部栏：返回按钮 + 标题 */
export default function TopBar({ title, subtitle, right = null, showBack = true }) {
  const navigate = useNavigate()
  const location = useLocation()

  // 直接从某个子页面打开（没有上一页）时，返回首页而不是离开应用
  const goBack = () => {
    if (location.key === 'default') navigate('/')
    else navigate(-1)
  }

  return (
    <header className="topbar">
      {showBack ? (
        <button type="button" className="icon-btn" onClick={goBack} aria-label="返回">
          ←
        </button>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 className="topbar__title">{title}</h1>
        {subtitle ? <div className="topbar__sub">{subtitle}</div> : null}
      </div>
      {right}
    </header>
  )
}
