import { Component, Suspense, lazy } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import UpdateBanner from './components/UpdateBanner'
import { AppStateProvider } from './state/AppState'

// 路由级懒加载：首屏只下载当前页面 + 共享 chunk，
// 其他页面（含 200KB+ 的 drinks.js 数据链）在首次访问时才加载。
const HomePage = lazy(() => import('./pages/HomePage'))
const RandomPage = lazy(() => import('./pages/RandomPage'))
const WheelPage = lazy(() => import('./pages/WheelPage'))
const DrinkPage = lazy(() => import('./pages/DrinkPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))

/** 路由切换时的加载占位：与页面转场风格一致，避免白屏闪烁 */
function RouteFallback() {
  return (
    <div className="page">
      <div className="empty" role="status" aria-live="polite">
        <span className="empty__emoji" aria-hidden="true">
          🍜
        </span>
        <span className="empty__title">正在加载…</span>
      </div>
    </div>
  )
}

/**
 * 懒路由加载失败兜底（chunk 404 / 离线时访问未预缓存的路由）。
 * React.lazy 会缓存 rejected 的 promise，单纯 setState 重试拿不到新 chunk，
 * 因此"重新加载"走整页刷新：新部署后刷新能拿到最新 index.html 与 chunk，
 * 离线时则由 SW 返回预缓存首页。
 * resetKey 随路由变化：切到别的路由自动清除错误态。
 */
class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page">
          <div className="empty" role="alert">
            <span className="empty__emoji" aria-hidden="true">
              📡
            </span>
            <span className="empty__title">页面加载失败</span>
            <p className="empty__text">可能是离线或网络不稳定，检查连接后重试。</p>
            <button type="button" className="btn" onClick={() => window.location.reload()}>
              重新加载
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function AppLayout() {
  const location = useLocation()
  // 转盘页作为沉浸模式，隐藏底部导航
  const immersive = location.pathname === '/wheel'

  return (
    <MotionConfig reducedMotion="user">
      <div className={`app-shell${immersive ? ' app-shell--immersive' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            className="page"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: [0.22, 0.9, 0.3, 1] }}
          >
            <RouteErrorBoundary resetKey={location.pathname}>
              <Suspense fallback={<RouteFallback />}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/random" element={<RandomPage />} />
                  <Route path="/wheel" element={<WheelPage />} />
                  <Route path="/drink" element={<DrinkPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  {/* 未知路径显式回首页，而不是静默渲染首页内容（URL 与内容不一致） */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </RouteErrorBoundary>
          </motion.main>
        </AnimatePresence>
      </div>

      {immersive ? null : <BottomNav />}
      <UpdateBanner />
      <Toast />
    </MotionConfig>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </AppStateProvider>
  )
}
