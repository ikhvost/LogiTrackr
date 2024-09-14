import { pgTable, serial, varchar, timestamp, text, integer, json, AnyPgColumn } from 'drizzle-orm/pg-core'

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 255 }).notNull(),
  lastVersionId: integer('version_id').references((): AnyPgColumn => versions.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at'),
})

export const versions = pgTable('versions', {
  id: serial('id').primaryKey(),
  resourceId: integer('resource_id').references((): AnyPgColumn => resources.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  changeLog: text('change_log'),
})

export const changes = pgTable('changes', {
  id: serial('id').primaryKey(),
  versionId: integer('version_id').references((): AnyPgColumn => versions.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  newValue: json('new_value'),
  oldValue: json('old_value'),
})
