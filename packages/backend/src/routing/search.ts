import { SearchQuery, searchQuerySchema, searchResponseSchema } from '@logitrackr/contracts'
import { FastifyRequest, RouteOptions, RouteHandlerMethod, FastifyReply } from 'fastify'
import { eq, desc, count as countFn, or, ilike, and } from 'drizzle-orm'
import { Database } from '../core/database'
import { resources, versions } from '../model/database'

const endpoints: RouteOptions[] = [
  {
    url: '/search',
    method: 'GET',
    schema: {
      querystring: searchQuerySchema,
      response: { 200: searchResponseSchema },
    },
    handler: (async (
      {
        query: { q: search, page, size },
        container,
      }: FastifyRequest<{
        Querystring: SearchQuery
      }>,
      reply: FastifyReply,
    ) => {
      const db = container.get<Database>(Database)

      const condition = search
        ? or(ilike(resources.externalId, `%${search}%`), ilike(resources.type, `%${search}%`))
        : undefined

      const [{ count }] = await db
        .select({ count: countFn() })
        .from(resources)
        .where(condition ? and(condition) : undefined)

      const result = await db
        .select({
          id: resources.id,
          externalId: resources.externalId,
          type: resources.type,
          createdAt: resources.createdAt,
          updatedAt: resources.updatedAt,
          lastVersion: {
            id: versions.id,
            createdAt: versions.createdAt,
            revision: versions.revision,
            data: versions.data,
          },
        })
        .from(resources)
        .leftJoin(versions, eq(resources.lastVersionId, versions.id))
        .where(condition)
        .orderBy(desc(resources.updatedAt))
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
