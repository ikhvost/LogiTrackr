import fastify, { FastifyInstance } from 'fastify'
import fastifyEnv from '@fastify/env'
import fastifyCors from '@fastify/cors'
import { ContainerModule } from 'inversify'

import routing from '../routing'
import { Hook, HookFn } from './hooks'
import { configSchema } from '../model'

export const Application = Symbol.for('application')
export type Application = FastifyInstance

export default new ContainerModule((bind) => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue(async (container) => {
    const app = fastify({ logger: true })
      .register(fastifyEnv, { schema: configSchema, dotenv: true })
      .register(fastifyCors)

    routing.forEach((route) => app.route(route))

    app.addHook('onRequest', (request, _reply, done) => {
      request.container = container

      done()
    })

    await app.ready()

    container.bind(Application).toConstantValue(app)
  })
  bind<HookFn>(Hook.Start).toConstantValue(async (container) => {
    const app = container.get<Application>(Application)
    await app.listen({ port: app.config.APP_PORT })
  })
})
