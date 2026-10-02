import { Suspense, lazy } from 'react'
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
