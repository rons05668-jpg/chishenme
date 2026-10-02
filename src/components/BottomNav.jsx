import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', icon: '🏠', label: '首页', end: true },
  { to: '/random', icon: '🎲', label: '随机' },
  { to: '/wheel', icon: '🎡', label: '转盘' },
  { to: '/history', icon: '🕘', label: '记录' },
  { to: '/favorites', icon: '❤️', label: '收藏' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
