import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { markPwaUpdateReady, shouldReloadOnControllerChange } from './lib/pwaUpdate'
import './styles/theme.css'
import './styles/components.css'
import './styles/pages.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// PWA：仅在正式构建产物中注册 Service Worker，避免开发时缓存模块
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // SW 接管后重载一次，让页面用上新版本资源。
  // 首次安装也会触发 controllerchange（controller 从无到有），
  // 那种情况下不能重载，否则用户第一次打开页面就被无故刷新一次。
  // 因此只有「用户主动点了立即刷新」才重载；flag 额外防止无限循环。
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    if (!shouldReloadOnControllerChange()) return
    refreshing = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // 已经处于 waiting 状态的更新（例如上次没刷新就关掉了）
        if (registration.waiting && navigator.serviceWorker.controller) {
          markPwaUpdateReady(registration.waiting)
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            // controller 存在说明是「更新」而非首次安装，此时才提示
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              markPwaUpdateReady(newWorker)
            }
          })
        })
      })
      .catch((error) => {
        // 注册失败不影响正常使用，但要留一条可观测的记录，
        // 否则线上 SW 失效时完全无从排查。
        console.warn('[pwa] service worker 注册失败', error)
      })
  })
}
