#!/usr/bin/env node
/**
 * 生产启动脚本（供云托管 / 单端口沙箱使用）
 * ------------------------------------------------------------------
 * 平台会注入 PORT 环境变量，并要求服务监听 0.0.0.0。
 * 流程：产物缺失时先执行 npm run build，然后以 0.0.0.0:$PORT 启动静态预览。
 *
 * 本地也可以直接跑：npm start（默认 4173 端口）
 */
const { spawn, spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')
const VITE_BIN = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
const PORT = process.env.PORT || '4173'
const DIST_INDEX = path.join(ROOT, 'dist', 'index.html')

if (!fs.existsSync(VITE_BIN)) {
  console.error('[serve] 未找到 vite，请先执行 npm install')
  process.exit(1)
}

if (!fs.existsSync(DIST_INDEX)) {
  // 注意：必须走 npm run build（vite build + gen-precache），不能直接调 vite build——
  // 后者会跳过 precache.json 生成和 sw.js 的 BUILD_ID 注入，导致 SW 永不更新。
  console.log('[serve] 未找到构建产物，先执行 npm run build …')
  const build = spawnSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit', shell: true })
  if (build.status !== 0) {
    console.error('[serve] 构建失败，已中止')
    process.exit(build.status ?? 1)
  }
}

console.log(`[serve] 以 0.0.0.0:${PORT} 启动预览服务`)
const child = spawn(
  process.execPath,
  [VITE_BIN, 'preview', '--host', '0.0.0.0', '--port', String(PORT), '--strictPort'],
  { cwd: ROOT, stdio: 'inherit' }
)

child.on('exit', (code) => process.exit(code ?? 0))
process.on('SIGTERM', () => child.kill('SIGTERM'))
process.on('SIGINT', () => child.kill('SIGINT'))
