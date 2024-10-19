import type { JSONSchemaType } from 'ajv'
import { PaginationQuery, paginationQuerySchema, Paginated, metadataSchema } from './pagination'
import { Version, versionSchema } from './version'

export interface SearchResponse {
  id: string
  externalId: string
  type: string
  createdAt: string
  updatedAt: string
  lastVersion: Version
}

export interface SearchQuery extends PaginationQuery {
  q: string
}

export const searchQuerySchema: JSONSchemaType<SearchQuery> = {
  type: 'object',
  properties: {
    ...paginationQuerySchema.properties,
    q: { type: 'string', default: '' },
  },
  required: ['q', 'page', 'size'],
}

export const searchResponseSchema: JSONSchemaType<Paginated<SearchResponse>> = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          externalId: { type: 'string' },
          type: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          lastVersion: versionSchema,
        },
        required: ['id', 'externalId', 'type', 'createdAt', 'updatedAt', 'lastVersion'],
        additionalProperties: false,
      },
    },
    metadata: metadataSchema,
  },
  required: ['data', 'metadata'],
  additionalProperties: false,
}
