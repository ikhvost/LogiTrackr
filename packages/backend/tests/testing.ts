import { interfaces } from 'inversify'
import { InjectOptions } from 'fastify'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { bootstrapper, Application } from '../src/core'
import { Database } from '../src/core/database'
import { resources, versions } from '../src/model'

export class Testing {
  constructor(private readonly container: interfaces.Container) {}

  static setup = async () => {
    const service = await bootstrapper()
    const testing = new Testing(service.container)

    await testing.migrate()
    await testing.clean()

    return testing
  }

  get db() {
    return this.container.get<Database>(Database)
  }

  async request(options: InjectOptions) {
    const app = this.container.get<Application>(Application)

    return app.inject(options)
  }

  async migrate() {
    const db = this.container.get<Database>(Database)

    await migrate(db, { migrationsFolder: './migrations' })
  }

  async clean() {
    const db = this.container.get<Database>(Database)

    await db.delete(resources)
    await db.delete(versions)
  }
}
