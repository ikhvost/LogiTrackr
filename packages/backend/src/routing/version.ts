import { FastifyRequest, RouteOptions, RouteHandlerMethod, FastifyReply } from 'fastify'
import { Database } from '../core/database'
import { versions } from '../model/schema'
import { eq, desc, count as countFn } from 'drizzle-orm'

const endpoints: RouteOptions[] = [
  {
    url: '/resources/:resourceId/versions',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          size: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
      },
      params: {
        type: 'object',
        properties: {
          resourceId: { type: 'string', format: 'uuid' },
        },
        required: ['resourceId'],
      },
    },
    handler: (async (
      {
        params,
        query,
        container,
      }: FastifyRequest<{
        Params: { resourceId: string }
        Querystring: { page?: number; size?: number }
      }>,
      reply: FastifyReply,
    ) => {
      const db = container.get<Database>(Database)

      const page = query.page || 1
      const size = query.size || 20
      const offset = (page - 1) * size

      const [{ count }] = await db
        .select({ count: countFn() })
        .from(versions)
        .where(eq(versions.resourceId, params.resourceId))

      const result = await db
        .select({
          id: versions.id,
          createdAt: versions.createdAt,
          data: versions.data,
        })
        .from(versions)
        .where(eq(versions.resourceId, params.resourceId))
        .orderBy(desc(versions.createdAt))
        .limit(size)
        .offset(offset)

      const totalPages = Math.ceil(count / size)

      return reply.status(200).send({
        versions: result,
        metadata: {
          totalCount: count,
          currentPage: page,
          totalPages,
        },
      })
    }) as RouteHandlerMethod,
  },
]

export default endpoints
