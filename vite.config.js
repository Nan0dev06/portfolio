import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // three is the bulk of the bundle and changes far less often than the
        // site itself — split it so repeat visitors keep it cached. Only three:
        // it has no dependencies, so nothing the phone path needs (react,
        // zustand) can get folded into a 3D chunk that phones never load.
        manualChunks(id) {
          if (/node_modules\/three\//.test(id)) return 'three'
        },
      },
    },
  },
})
