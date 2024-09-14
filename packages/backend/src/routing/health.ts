import { RouteOptions, FastifyReply } from 'fastify'

const endpoints: RouteOptions[] = [
  {
    url: '/health',
    method: 'GET',
    handler: (_, reply: FastifyReply) => reply.send({ status: 'ok' }),
  },
]

export default endpoints
