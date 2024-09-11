import { FastifyRequest, RouteOptions, RouteHandlerMethod, FastifyReply } from 'fastify'
import { Database } from '../core/database'
import { resources, versions } from '../model'
import { eq } from 'drizzle-orm'

export interface ResourcePayload {
  id: string
  type: string
  data: Record<string, unknown>
}

const endpoints: RouteOptions[] = [{
  url:       '/resources',
  method:    'POST',
  bodyLimit: 1048576, // limits the overall size of the JSON to 1MB
  schema:    {
    body: {
      type:       'object',
      properties: {
        id: {
          type:      'string',
          minLength: 1,
          maxLength: 36,
        },
        type: {
          type:      'string',
          minLength: 1,
          maxLength: 50,
        },
        data: {
          type:                 'object',
          additionalProperties: true,
        },
      },
      required:             ['id', 'type', 'data'],
      additionalProperties: false,
    },
  },
  handler: (async ({ container, body }: FastifyRequest<{ Body: ResourcePayload }>, reply: FastifyReply) => {
    const db = container.get<Database>(Database)

    return db.transaction(async tx => {
      const [version] = await tx.insert(versions).values({ data: body.data }).returning()
      const [exists] = await tx.select().from(resources).where(eq(resources.externalId, body.id)).limit(1)
      const [resource] = exists
        ? await tx.update(resources).set({ lastVersionId: version.id }).where(eq(resources.externalId, body.id)).returning()
        : await tx.insert(resources).values({ externalId: body.id, type: body.type, lastVersionId: version.id }).returning()

      await tx.update(versions).set({ resourceId: resource.id }).where(eq(versions.id, version.id))
    })
      .then(() => reply.status(200).send({ message: 'Resource updated' }))
      .catch(() => reply.status(500).send({ message: 'Failed to update resource' }))
  }) as RouteHandlerMethod,
}]

export default endpoints
