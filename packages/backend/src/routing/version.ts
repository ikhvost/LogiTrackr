import {
  paginationQuerySchema,
  idSchema,
  PaginationQuery,
  Identifiable,
  versionListSchema,
} from '@logitrackr/contracts'
import { FastifyRequest, RouteOptions, RouteHandlerMethod, FastifyReply } from 'fastify'
import { eq, desc, count as countFn } from 'drizzle-orm'
import { Database } from '../core/database'
import { versions } from '../model/database'

const endpoints: RouteOptions[] = [
  {
    url: '/resources/:id/versions',
    method: 'GET',
    schema: {
      querystring: paginationQuerySchema,
      params: idSchema,
      response: { 200: versionListSchema },
    },
    handler: (async (
      {
        params,
        query: { page, size },
        container,
      }: FastifyRequest<{
        Params: Identifiable
        Querystring: PaginationQuery
      }>,
      reply: FastifyReply,
    ) => {
      const db = container.get<Database>(Database)

      const [{ count }] = await db.select({ count: countFn() }).from(versions).where(eq(versions.resourceId, params.id))

      const result = await db
        .select({
          id: versions.id,
          createdAt: versions.createdAt,
          data: versions.data,
          revision: versions.revision,
        })
        .from(versions)
        .where(eq(versions.resourceId, params.id))
        .orderBy(desc(versions.revision))
        .limit(size)
        .offset((page - 1) * size)

      const totalPages = Math.ceil(count / size)

      return reply.status(200).send({
        data: result,
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
