import { JSONSchemaType } from 'ajv'
export interface Identifiable {
  id: string
}

export const idSchema: JSONSchemaType<Identifiable> = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', minLength: 1, maxLength: 50 },
  },
  required: ['id'],
  additionalProperties: false,
}
