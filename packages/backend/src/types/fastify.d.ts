import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { Config } from '../model/config'
import * as schema from '../model/database'

declare module 'fastify' {
  interface FastifyInstance {
    config: Config
  }

  interface FastifyRequest {
    db: PostgresJsDatabase<typeof schema>
  }
}
