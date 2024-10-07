import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/model/database.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION!,
  },
})
