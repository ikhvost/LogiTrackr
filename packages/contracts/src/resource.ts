import { JSONSchemaType } from 'ajv'
import { Identifiable } from './identifiable'

export interface Resource extends Identifiable {
  externalId: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface ResourcePayload extends Identifiable {
  type: string
  data: Record<string, unknown>
}

export const resourcePayloadSchema: JSONSchemaType<ResourcePayload> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    type: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    data: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: ['id', 'type', 'data'],
  additionalProperties: false,
}
