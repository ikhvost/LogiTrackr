import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: 'resources/index.html',
  },
  root: 'pages',
  build: {
    outDir: '../build',
    rollupOptions: {
      input: {
        main: resolve(__dirname, './pages/resources/index.html'),
      },
    },
  },
})
