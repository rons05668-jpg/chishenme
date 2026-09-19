import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import FavoritesPage from './pages/FavoritesPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import RandomPage from './pages/RandomPage'
import WheelPage from './pages/WheelPage'
import { AppStateProvider } from './state/AppState'

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
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/random" element={<RandomPage />} />
              <Route path="/wheel" element={<WheelPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </div>

      {immersive ? null : <BottomNav />}
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
