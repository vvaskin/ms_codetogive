CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`title_zh` text,
	`description` text,
	`description_zh` text,
	`location` text NOT NULL,
	`location_zh` text,
	`starts_at` integer NOT NULL,
	`ends_at` integer,
	`audience` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "event_audience_check" CHECK("event"."audience" in ('members', 'volunteers', 'everyone')),
	CONSTRAINT "event_status_check" CHECK("event"."status" in ('draft', 'published', 'cancelled')),
	CONSTRAINT "event_date_order_check" CHECK("event"."ends_at" is null or "event"."ends_at" >= "event"."starts_at")
);
--> statement-breakpoint
CREATE INDEX `event_starts_at_idx` ON `event` (`starts_at`);--> statement-breakpoint
CREATE INDEX `event_status_idx` ON `event` (`status`);