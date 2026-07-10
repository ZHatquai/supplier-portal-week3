import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Corporate Supplier Sustainability Portal 2026
// Static SPA — no backend, no server functions, no env vars. Deploys to Netlify.
export default defineConfig({
  plugins: [react()],
})
