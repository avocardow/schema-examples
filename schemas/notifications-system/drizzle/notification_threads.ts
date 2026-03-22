// notification_threads: Thread-level state for grouping related notifications. Per-thread read tracking, metadata, and efficient "threads with unread" queries.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notificationCategories } from "./notification_categories";

export const notificationThreads = pgTable(
  "notification_threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    threadKey: text("thread_key").unique().notNull(), // e.g., "issue:456", "pr:789". Must match the thread_key on events.

    // Thread metadata: displayed in the thread list UI.
    title: text("title"), // e.g., "Fix login bug (#456)". Can be updated as the thread evolves.
    icon: text("icon"), // Icon URL or icon identifier for the thread.
    categoryId: uuid("category_id").references(
      () => notificationCategories.id,
      { onDelete: "set null" }
    ), // Optional: associate the thread with a category for filtering.

    // Counter cache: avoids COUNT(*) on every thread list render.
    notificationCount: integer("notification_count").notNull().default(0),

    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }), // When the most recent event in this thread occurred.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notification_threads_category_id").on(table.categoryId),
    index("idx_notification_threads_last_activity_at").on(table.lastActivityAt),
  ]
);
