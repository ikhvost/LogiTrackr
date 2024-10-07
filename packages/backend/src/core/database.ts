import postgres from 'postgres'
import { ContainerModule } from 'inversify'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { Hook, HookFn } from './hooks'

import * as schema from '../model/database'
import { Application } from './application'

export const Database = Symbol.for('database')
export type Database = PostgresJsDatabase

export default new ContainerModule((bind) => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue(async (container) => {
    const app = container.get<Application>(Application)
    const client = postgres(app.config.DATABASE_CONNECTION)
    const database = drizzle(client, { schema })

    container.bind(Database).toConstantValue(database)
  })
})
