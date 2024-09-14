import * as dotenv from 'dotenv'

import { ContainerModule } from 'inversify'
import { JSONSchemaType } from 'ajv'

import { ConfigDiscovery } from '../util/discovery'
import { Hook, HookFn } from './hooks'

interface ConfigSchema {
  app: {
    port: number
  }
  database: {
    connection: string
  }
}

export type Config = ConfigSchema
export const Config = Symbol('config')
export const Prefix = 'AUDIT'

const schema: JSONSchemaType<Config> = {
  additionalProperties: true,
  type: 'object',
  required: ['app', 'database'],
  properties: {
    app: {
      type: 'object',
      required: ['port'],
      properties: {
        port: {
          type: 'number',
        },
      },
    },
    database: {
      type: 'object',
      required: ['connection'],
      properties: {
        connection: {
          type: 'string',
        },
      },
    },
  },
}

export default new ContainerModule((bind) => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue((container) => {
    dotenv.config()

    const configDiscovery = new ConfigDiscovery()
    const config = configDiscovery.discover(schema as JSONSchemaType<ConfigSchema> & { properties: object }, Prefix)

    container.bind(Config).toConstantValue(config)
  })
})
