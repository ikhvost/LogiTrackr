import postgres from 'postgres'
import { ContainerModule } from 'inversify'
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'

import { Hook, HookFn } from './hooks'
import { Config } from './config'

export const Database = Symbol.for('database')
export type Database = NodePgDatabase<Record<string, never>>

export default new ContainerModule(bind => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue(async container => {
    const config = container.get<Config>(Config)
    const client = postgres(config.database.connection)
    const database = drizzle(client)

    container.bind(Database).toConstantValue(database)
  })
})
