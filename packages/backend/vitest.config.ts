import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    setupFiles: './tests/setup.ts',
  },
})
