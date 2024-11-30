import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
