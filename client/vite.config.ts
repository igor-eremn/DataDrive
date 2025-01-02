import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_APP_API_BASE_URL: process.env.VITE_APP_API_BASE_URL,
  },
})
