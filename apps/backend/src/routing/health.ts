import { RouteOptions } from 'fastify'

const health: RouteOptions = {
  url:    '/health',
  method: 'GET',

  handler: (_, res) => {
    void res.send({
      status: 'ok',
    })
  },
}

export default [
  health,
]
