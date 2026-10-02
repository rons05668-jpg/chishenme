/* 今天吃什么？ —— 简易离线缓存 Service Worker
   策略：静态资源优先走缓存，后台顺带更新；导航请求离线时回退到首页。 */

const CACHE = 'tqsc-cache-v2'
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/icons/apple-touch-icon.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      /*
       * 分两段预缓存，避免「一颗老鼠屎坏一锅汤」：
       *
       * 第一段 —— 核心资源（首页、manifest、图标）：离线可用的底线，
       * 用 addAll 一次性写入，任一失败即抛错，让本次 install 失败并在下次访问时重试。
       *
       * 第二段 —— 构建产物（带内容哈希的 /assets/*.js|css）：从 index.html 正则解析得到。
       * 这些文件名每次构建都会变，数量也随代码增长，此前与核心资源混在同一个 addAll 里，
       * 任一资源 404 或网络抖动都会让整个 install 失败 —— SW 装不上，离线功能全灭。
       * 现在改为逐个缓存：单个失败只 console.warn 跳过，不影响 SW 安装成功。
       */
      await cache.addAll(PRECACHE)

      /*
       * 第二段 —— 构建产物（带内容哈希的 /assets/*.js|css）。
       * 清单由构建脚本 scripts/gen-precache.cjs 生成（dist/precache.json），
       * 包含路由懒加载的动态 chunk——它们不会出现在 index.html 里，
       * 只解析 index.html 的话，离线时访问懒路由会白屏。
       * 逐个缓存：单个失败只 console.warn 跳过，不影响 SW 安装成功。
       * 清单拿不到时（极端情况）降级为解析 index.html。
       */
      let extraAssets = []
      try {
        const manifest = await fetch('/precache.json', { cache: 'reload' })
        if (manifest.ok) extraAssets = await manifest.json()
      } catch {
        /* 降级走下面的 index.html 解析 */
      }
      if (!Array.isArray(extraAssets) || !extraAssets.length) {
        // 首次访问的 JS/CSS 在注册 SW 之前已加载，必须主动预缓存才能首次安装后离线使用。
        const response = await fetch('/index.html', { cache: 'reload' })
        if (!response.ok) throw new Error('离线页面预缓存失败')
        const html = await response.text()
        extraAssets = [...new Set(
          [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1])
        )]
      }

      const results = await Promise.allSettled(extraAssets.map((asset) => cache.add(asset)))
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn('[sw] 构建产物预缓存失败，已跳过：', extraAssets[index], result.reason)
        }
      })
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
