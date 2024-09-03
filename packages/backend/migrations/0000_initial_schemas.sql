CREATE TABLE IF NOT EXISTS "changes" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"new_value" json,
	"old_value" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"version_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"change_log" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changes" ADD CONSTRAINT "changes_version_id_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resources" ADD CONSTRAINT "resources_version_id_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "versions" ADD CONSTRAINT "versions_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
