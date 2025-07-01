import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  define: {
    // Ensure environment variables are available at build time
    'import.meta.env.VITE_PREVIEW_MODE': JSON.stringify(process.env.VITE_PREVIEW_MODE || 'false')
  }
})