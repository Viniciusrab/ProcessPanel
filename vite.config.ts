import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // expõe em todas as interfaces (LAN)
    port: 5174       // garante que use a porta 5174
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa Firebase em chunk próprio
          firebase: ['firebase/app', 'firebase/auth'],
          // Separa React Router
          router: ['react-router-dom'],
          // Separa UI components
          ui: ['lucide-react']
        }
      }
    },
    // Reduz tamanho do chunk inicial
    chunkSizeWarningLimit: 600
  }
})
