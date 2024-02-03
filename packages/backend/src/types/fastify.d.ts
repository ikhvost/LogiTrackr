import { interfaces } from 'inversify'

declare module 'fastify' {
  interface FastifyRequest {
    container: interfaces.Container
  }
}
