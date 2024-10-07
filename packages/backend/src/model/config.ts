import { JSONSchemaType } from 'ajv'

export type Config = {
  APP_PORT: number
  DATABASE_CONNECTION: string
}

export const configSchema: JSONSchemaType<Config> = {
  additionalProperties: true,
  type: 'object',
  required: ['APP_PORT', 'DATABASE_CONNECTION'],
  properties: {
    APP_PORT: {
      type: 'number',
    },
    DATABASE_CONNECTION: {
      type: 'string',
    },
  },
}
