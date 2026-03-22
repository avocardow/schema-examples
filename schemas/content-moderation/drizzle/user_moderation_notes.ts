// user_moderation_notes: Internal moderator notes on user accounts.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const userModerationNotes = pgTable(
  "user_moderation_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(), // FK → users.id. The user this note is about. Cascade: deleting a user removes all their notes.
    authorId: uuid("author_id").notNull(), // FK → users.id. The moderator who wrote this note. Restrict: don't delete moderators who have notes.
    body: text("body").notNull(), // The note text. Internal-only, never shown to the user.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_user_moderation_notes_user_id").on(table.userId),
    index("idx_user_moderation_notes_author_id").on(table.authorId),
  ]
);
