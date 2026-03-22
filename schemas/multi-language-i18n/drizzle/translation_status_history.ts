// translation_status_history: Audit log of translation status changes.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const translationStatusHistory = pgTable(
  "translation_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    translationType: text("translation_type").notNull(),
    translationId: uuid("translation_id").notNull(),
    fromStatus: text("from_status"),
    toStatus: text("to_status").notNull(),
    changedBy: uuid("changed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_translation_status_history_translation_type_translation_id").on(
      table.translationType,
      table.translationId
    ),
    index("idx_translation_status_history_changed_by").on(table.changedBy),
  ]
);
