#!/usr/bin/env node
/**
 * 生成 dist/precache.json，并给 dist/sw.js 注入构建版本号。
 * ------------------------------------------------------------------
 * 1. 扫描 dist/assets，把带内容哈希的产物全写进 dist/precache.json，
 *    供 Service Worker 安装时预缓存。路由懒加载后，动态 chunk 不会
 *    出现在 index.html 里，SW 若只解析 index.html 就拿不到它们，
 *    离线时懒路由会白屏。
 * 2. 用 dist/assets 文件名列表的 sha1（前 10 位）作为 BUILD_ID，
 *    替换 dist/sw.js 里的 `__BUILD_ID__` 占位符。CACHE 名随构建变化，
 *    浏览器才能靠 sw.js 字节比对发现新版本并重新 install；
 *    否则凡是不改 public/sw.js 的部署都不会触发 SW 更新，
 *    precache.json 永不被消费、旧缓存无限堆积。
 *    占位符缺失时报错退出，绝不静默跳过。
 *
 * 运行：npm run build（已串在 build 脚本里）
 */
'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const DIST = path.join(__dirname, '..', 'dist')
const ASSETS = path.join(DIST, 'assets')
const SW_PATH = path.join(DIST, 'sw.js')
const PLACEHOLDER = '__BUILD_ID__'

const files = fs
  .readdirSync(ASSETS)
  .filter((name) => /\.(js|css)$/.test(name))
  .sort()
  .map((name) => `/assets/${name}`)

// BUILD_ID：文件名列表的 sha1 前 10 位 —— 稳定且随内容变化
const buildId = crypto
  .createHash('sha1')
  .update(files.join('\n'), 'utf8')
  .digest('hex')
  .slice(0, 10)

const swSource = fs.readFileSync(SW_PATH, 'utf8')
if (!swSource.includes(PLACEHOLDER)) {
  console.error(`gen-precache: ${SW_PATH} 里找不到 ${PLACEHOLDER} 占位符，拒绝继续`)
  process.exit(1)
}
fs.writeFileSync(SW_PATH, swSource.replaceAll(PLACEHOLDER, buildId), 'utf8')
console.log(`sw.js: BUILD_ID=${buildId}`)

fs.writeFileSync(path.join(DIST, 'precache.json'), `${JSON.stringify(files, null, 2)}\n`, 'utf8')
console.log(`precache.json: ${files.length} 个构建产物`)
