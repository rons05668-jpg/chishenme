import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    // 部署到云托管时，平台会通过反向代理访问该端口，
    // 不放开 allowedHosts 会被 Vite 以 "Blocked request. This host is not allowed." 拒绝。
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 保持默认 500：bundle 膨胀时要收到告警，而不是把阈值抬高消音
    chunkSizeWarningLimit: 500,
  },
})
