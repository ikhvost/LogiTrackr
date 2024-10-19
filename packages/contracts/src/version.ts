import type { JSONSchemaType } from 'ajv'
import { Identifiable } from './identifiable'
import { metadataSchema, Paginated } from './pagination'

export interface Version extends Identifiable {
  createdAt: string
  revision: number
  data: Record<string, unknown>
}

export const versionSchema: JSONSchemaType<Version> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    revision: { type: 'number' },
    data: { type: 'object', additionalProperties: true },
  },
  required: ['id', 'createdAt', 'revision', 'data'],
}

export const versionListSchema: JSONSchemaType<Paginated<Version>> = {
  type: 'object',
  properties: {
    data: { type: 'array', items: versionSchema },
    metadata: metadataSchema,
  },
  required: ['data', 'metadata'],
}
