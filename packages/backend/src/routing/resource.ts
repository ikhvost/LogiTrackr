import { ResourcePayload, resourcePayloadSchema } from '@logitrackr/contracts'
import { FastifyRequest, RouteOptions, RouteHandlerMethod, FastifyReply } from 'fastify'
import { eq } from 'drizzle-orm'
import { resources, versions } from '../model/database'

const endpoints: RouteOptions[] = [
  {
    url: '/resources',
    method: 'POST',
    bodyLimit: 1048576, // limits the overall size of the JSON to 1MB
    schema: { body: resourcePayloadSchema },
    handler: (async ({ db, body }: FastifyRequest<{ Body: ResourcePayload }>, reply: FastifyReply) => {
      return db
        .transaction(async (tx) => {
          const [exists] = await tx
            .select({ resource: resources, version: versions })
            .from(resources)
            .leftJoin(versions, eq(resources.lastVersionId, versions.id))
            .where(eq(resources.externalId, body.id))
            .limit(1)

          const [version] = await tx
            .insert(versions)
            .values({
              data: body.data,
              revision: exists?.version?.revision ? exists.version.revision + 1 : 1,
            })
            .returning()

          const [resource] = exists?.resource
            ? await tx
                .update(resources)
                .set({ lastVersionId: version.id })
                .where(eq(resources.externalId, body.id))
                .returning()
            : await tx
                .insert(resources)
                .values({ externalId: body.id, type: body.type, lastVersionId: version.id })
                .returning()

          await tx.update(versions).set({ resourceId: resource.id }).where(eq(versions.id, version.id))
        })
        .then(() => reply.status(200).send({ message: 'Resource updated' }))
        .catch(() => reply.status(500).send({ message: 'Failed to update resource' }))
    }) as RouteHandlerMethod,
  },
]

export default endpoints
