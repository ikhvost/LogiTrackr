import * as dotenv from 'dotenv'

import { ContainerModule } from 'inversify'
import { JSONSchemaType } from 'ajv'

import { ConfigDiscovery } from '../util/discovery'
import { Hook, HookFn } from './hooks'

interface ConfigSchema {
  app: {
    port: number
  }
}

export type Config = ConfigSchema
export const Config = Symbol('config')
export const Prefix = 'VERSIONING'

const schema: JSONSchemaType<Config> = {
  additionalProperties: true,
  type:                 'object',
  required:             ['app'],
  properties:           {
    app: {
      type:       'object',
      required:   ['port'],
      properties: {
        port: {
          type:    'number',
          default: 3000,
        },
      },
    },
  },
}

export default new ContainerModule(bind => {
  bind<HookFn>(Hook.Bootstrap).toConstantValue(container => {
    dotenv.config()

    const configDiscovery = new ConfigDiscovery()
    const config = configDiscovery.discover(schema as JSONSchemaType<ConfigSchema> & { properties: object }, Prefix)

    container.bind(Config).toConstantValue(config)
  })
})
