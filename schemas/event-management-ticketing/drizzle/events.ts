// events: Core event records with scheduling, status, and registration details.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { eventSeries } from "./event_series";
import { eventCategories } from "./event_categories";
import { venues } from "./venues";
import { users } from "../../auth-rbac/drizzle/users";

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "cancelled",
  "postponed",
  "completed",
]);

export const eventVisibilityEnum = pgEnum("event_visibility", [
  "public",
  "private",
  "unlisted",
]);

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seriesId: uuid("series_id").references(() => eventSeries.id, {
      onDelete: "set null",
    }),
    categoryId: uuid("category_id").references(() => eventCategories.id, {
      onDelete: "set null",
    }),
    venueId: uuid("venue_id").references(() => venues.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary"),
    description: text("description"),
    coverImageUrl: text("cover_image_url"),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    timezone: text("timezone").notNull(),
    isAllDay: boolean("is_all_day").notNull().default(false),
    maxAttendees: integer("max_attendees"),
    status: eventStatusEnum("status").notNull().default("draft"),
    visibility: eventVisibilityEnum("visibility")
      .notNull()
      .default("public"),
    registrationOpenAt: timestamp("registration_open_at", {
      withTimezone: true,
    }),
    registrationCloseAt: timestamp("registration_close_at", {
      withTimezone: true,
    }),
    isFree: boolean("is_free").notNull().default(false),
    contactEmail: text("contact_email"),
    websiteUrl: text("website_url"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_events_series_id").on(table.seriesId),
    index("idx_events_category_id").on(table.categoryId),
    index("idx_events_venue_id").on(table.venueId),
    index("idx_events_status_start_time").on(table.status, table.startTime),
    index("idx_events_visibility").on(table.visibility),
    index("idx_events_start_time_end_time").on(
      table.startTime,
      table.endTime,
    ),
    index("idx_events_created_by").on(table.createdBy),
  ],
);
