// event_updates: Announcements and news posts published for a specific event.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "../../auth-rbac/drizzle/users";

export const eventUpdates = pgTable(
  "event_updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    isPublished: boolean("is_published").notNull().default(false),
    isPinned: boolean("is_pinned").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_event_updates_event_id_published").on(
      table.eventId,
      table.isPublished,
      table.publishedAt,
    ),
    index("idx_event_updates_author_id").on(table.authorId),
  ],
);
