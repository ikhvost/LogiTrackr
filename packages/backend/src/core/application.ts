import fastify, { FastifyInstance } from 'fastify'
import fastifyEnv from '@fastify/env'
import fastifyCors from '@fastify/cors'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../model/database'
import { configSchema } from '../model/config'
import routing from '../routing'

export const application = async (): Promise<FastifyInstance> => {
  const app = fastify({ logger: true })
    .register(fastifyEnv, { schema: configSchema, dotenv: true })
    .register(fastifyCors)

  await app.after()

  routing.forEach((route) => app.route(route))

  const client = postgres(app.config.DATABASE_CONNECTION)
  const db = drizzle(client, { schema })

  app.addHook('onRequest', (request, _reply, done) => {
    request.db = db
    done()
  })

  app.addHook('onClose', async () => {
    await client.end()
  })

  await app.ready()

  return app as FastifyInstance
}
