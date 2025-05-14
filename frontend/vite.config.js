import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  // ここにベースパスの設定を追加
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // SPAモードを有効化
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
