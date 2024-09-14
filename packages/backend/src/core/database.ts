import postgres from 'postgres'
import { ContainerModule } from 'inversify'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { Hook, HookFn } from './hooks'
import { Config } from './config'

import * as schema from '../model/schema'

export const Database = Symbol.for('database')
export type Database = PostgresJsDatabase

export default new ContainerModule((bind) => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue(async (container) => {
    const config = container.get<Config>(Config)
    const client = postgres(config.database.connection)
    const database = drizzle(client, { schema })

    container.bind(Database).toConstantValue(database)
  })
})
