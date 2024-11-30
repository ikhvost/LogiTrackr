import { FastifyInstance } from 'fastify'
import { application } from './core/application'

application()
  .then(async (app: FastifyInstance) => {
    await app.listen({ port: app.config.APP_PORT })
    process.on('SIGTERM', () => app.close().then(() => process.exit(1)))
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })
