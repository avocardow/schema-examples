// report_notes: Internal moderator notes on queue items.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { moderationQueueItems } from "./moderation_queue_items";
import { users } from "../../auth-rbac/drizzle/users";

export const reportNotes = pgTable(
  "report_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    queueItemId: uuid("queue_item_id")
      .notNull()
      .references(() => moderationQueueItems.id, { onDelete: "cascade" }),
    moderatorId: uuid("moderator_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    content: text("content").notNull(), // The note text. Internal-only, never shown to the reported user.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_report_notes_queue_item_id").on(table.queueItemId),
    index("idx_report_notes_moderator_id").on(table.moderatorId),
  ]
);
