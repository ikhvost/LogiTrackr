import { interfaces } from 'inversify'
import { Config } from '../model'

declare module 'fastify' {
  interface FastifyInstance {
    config: Config
  }

  interface FastifyRequest {
    container: interfaces.Container
  }
}
