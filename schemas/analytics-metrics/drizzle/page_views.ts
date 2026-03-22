// page_views: Individual page view records with viewport and duration data.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { events } from "./events";
import { sessions } from "./sessions";

export const pageViews = pgTable(
  "page_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").references(() => events.id, { onDelete: "set null" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    anonymousId: text("anonymous_id"),
    sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "set null" }),
    url: text("url").notNull(),
    path: text("path").notNull(),
    title: text("title"),
    referrer: text("referrer"),
    hostname: text("hostname").notNull(),
    viewportWidth: integer("viewport_width"),
    viewportHeight: integer("viewport_height"),
    screenWidth: integer("screen_width"),
    screenHeight: integer("screen_height"),
    duration: integer("duration"),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_page_views_user_id_timestamp").on(table.userId, table.timestamp),
    index("idx_page_views_session_id").on(table.sessionId),
    index("idx_page_views_path").on(table.path),
    index("idx_page_views_hostname_path").on(table.hostname, table.path),
    index("idx_page_views_timestamp").on(table.timestamp),
    index("idx_page_views_anonymous_id").on(table.anonymousId),
  ]
);
