import { pgTable, varchar, timestamp, json, AnyPgColumn, uuid } from 'drizzle-orm/pg-core'

export const resources = pgTable('resources', {
  id:            uuid('id').defaultRandom().primaryKey(),
  lastVersionId: uuid('version_id').references((): AnyPgColumn => versions.id, { onDelete: 'cascade' }),
  externalId:    varchar('external_id', { length: 36 }).notNull().unique(),
  type:          varchar('type', { length: 255 }).notNull(),
  createdAt:     timestamp('created_at').notNull().defaultNow(),
  updatedAt:     timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})

export const versions = pgTable('versions', {
  id:         uuid('id').defaultRandom().primaryKey(),
  resourceId: uuid('resource_id').references((): AnyPgColumn => resources.id, { onDelete: 'cascade' }),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
  data:       json('data').notNull(),
})
