import type { JSONSchemaType } from 'ajv'

export interface PaginationQuery {
  page: number
  size: number
}

export interface Metadata {
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface Paginated<T> {
  data: T[]
  metadata: Metadata
}

export const paginationQuerySchema: JSONSchemaType<PaginationQuery> = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    size: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  },
  additionalProperties: false,
  required: ['page', 'size'],
}

export const metadataSchema: JSONSchemaType<Metadata> = {
  type: 'object',
  properties: {
    totalCount: { type: 'integer', minimum: 0 },
    totalPages: { type: 'integer', minimum: 0 },
    currentPage: { type: 'integer', minimum: 1 },
  },
  required: ['totalCount', 'totalPages', 'currentPage'],
}
