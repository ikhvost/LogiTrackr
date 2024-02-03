import fastify, { FastifyInstance } from 'fastify'
import { ContainerModule } from 'inversify'

import routing from '../routing'
import { Hook, HookFn } from './hooks'
import { Config } from './config'

export const Application = Symbol.for('application')
export type Application = FastifyInstance

export default new ContainerModule(bind => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue(async container => {
    const app = fastify({
      logger: true,
    })

    routing.forEach(route => app.route(route))

    app.addHook('onRequest', (request, _reply, done) => {
      request.container = container

      done()
    })

    await app.ready()

    container.bind(Application).toConstantValue(app)
  })
  bind<HookFn>(Hook.Start).toConstantValue(async container => {
    const app = container.get<Application>(Application)
    const config = container.get<Config>(Config)

    await app.listen({ port: config.app.port })
  })
})
