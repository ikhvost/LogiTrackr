import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect:       'postgresql',
  schema:        './src/model/schema.ts',
  out:           './migrations',
  dbCredentials: {
    url: process.env.AUDIT__DATABASE__CONNECTION!,
  },
})
