import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `npm run dev` → HTTP (no browser cert warning on desktop).
// `npm run dev:phone` → HTTPS (needed for camera/AR on a phone over Wi‑Fi).
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'phone' ? [basicSsl()] : [])],
  base: './',
  server: {
    host: true,
  },
}))
