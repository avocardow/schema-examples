// translation_comments: Threaded comments on translations.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const translationComments = pgTable(
  "translation_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    translationType: text("translation_type").notNull(),
    translationId: uuid("translation_id").notNull(),
    // NOTE: Circular FK — cannot use .references() here
    parentId: uuid("parent_id"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    issueType: text("issue_type"),
    isResolved: boolean("is_resolved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_translation_comments_translation_type_translation_id").on(
      table.translationType,
      table.translationId
    ),
    index("idx_translation_comments_parent_id").on(table.parentId),
    index("idx_translation_comments_author_id").on(table.authorId),
  ]
);
