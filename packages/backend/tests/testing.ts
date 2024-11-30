import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { FastifyInstance, InjectOptions } from 'fastify'
import { application } from '../src/core/application'
import * as schema from '../src/model/database'

export class Testing {
  private readonly app: FastifyInstance
  private readonly database: PostgresJsDatabase<typeof schema>

  constructor(app: FastifyInstance) {
    const client = postgres(app.config.DATABASE_CONNECTION)
    const database = drizzle(client, { schema })

    this.app = app
    this.database = database
  }

  static setup = async () => {
    const app = await application()
    const testing = new Testing(app)

    await testing.migrate()
    await testing.clean()

    return testing
  }

  get db() {
    return this.database
  }

  async request(options: InjectOptions) {
    return this.app.inject(options)
  }

  async migrate() {
    await migrate(this.database, { migrationsFolder: './migrations' })
  }

  async clean() {
    await this.database.delete(schema.resources)
    await this.database.delete(schema.versions)
  }
}
