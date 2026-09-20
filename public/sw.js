/* 今天吃什么？ —— 简易离线缓存 Service Worker
   策略：静态资源优先走缓存，后台顺带更新；导航请求离线时回退到首页。 */

const CACHE = 'tqsc-cache-v2'
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/icons/apple-touch-icon.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(async (cache) => {
        // 首次访问的 JS/CSS 在注册 SW 之前已加载，必须主动预缓存才能首次安装后离线使用。
        const response = await fetch('/index.html', { cache: 'reload' })
        if (!response.ok) throw new Error('离线页面预缓存失败')
        const html = await response.text()
        const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1])
        await cache.addAll([...PRECACHE, ...assets])
      })
  )
})

// 新版本不再自动接管，先进入 waiting 状态，由页面提示用户后主动确认更新。
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('tqsc-cache-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put('/index.html', copy))
          }
          return response
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || caches.match('/')))
    )
    return
  }

  event.respondWith(
    // 带内容哈希的同源静态资源不因 Origin 变化而改变内容；
    // 预缓存请求与页面模块请求的 Vary: Origin 不同，离线时也应复用。
    caches.match(request, { ignoreVary: url.pathname.startsWith('/assets/') }).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === 'basic') {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
