import postgres from 'postgres'
import { ContainerModule } from 'inversify'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import { Hook, HookFn } from './hooks'
import { Config } from './config'

export const Database = Symbol.for('database')
export type Database = PostgresJsDatabase<Record<string, never>>

export default new ContainerModule(bind => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue(async container => {
    const config = container.get<Config>(Config)
    const client = postgres(config.database.connection)
    const database = drizzle(client)

    container.bind(Database).toConstantValue(database)
  })
})
