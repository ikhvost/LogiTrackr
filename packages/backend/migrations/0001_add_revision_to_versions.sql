ALTER TABLE "versions" ADD COLUMN "revision" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "versions" ADD CONSTRAINT "versions_revision_unique" UNIQUE("revision");