#!/usr/bin/env node
/**
 * 生成 dist/precache.json：列出全部构建产物（/assets/*.js|css）。
 * ------------------------------------------------------------------
 * 用途：Service Worker 安装时按这份清单预缓存。
 * 路由懒加载后，动态 chunk 不会出现在 index.html 里，
 * SW 若只解析 index.html 就拿不到它们，离线时懒路由会白屏。
 * 因此构建后扫描 dist/assets，把带内容哈希的产物全写进清单。
 *
 * 运行：npm run build（已串在 build 脚本里）
 */
'use strict'

const fs = require('node:fs')
const path = require('node:path')

const DIST = path.join(__dirname, '..', 'dist')
const ASSETS = path.join(DIST, 'assets')

const files = fs
  .readdirSync(ASSETS)
  .filter((name) => /\.(js|css)$/.test(name))
  .sort()
  .map((name) => `/assets/${name}`)

fs.writeFileSync(path.join(DIST, 'precache.json'), `${JSON.stringify(files, null, 2)}\n`, 'utf8')
console.log(`precache.json: ${files.length} 个构建产物`)
