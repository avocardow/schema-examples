// file_tags: Tag definitions for organizing files with visibility levels (public, private, system).
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const fileTagVisibilityEnum = pgEnum("file_tag_visibility", [
  "public",
  "private",
  "system",
]);

export const fileTags = pgTable(
  "file_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(), // Tag name (e.g., "important", "reviewed", "needs-update").
    color: text("color"), // Hex color for UI display (e.g., "#ff5733").

    // public = visible to all users.
    // private = visible only to the creator.
    // system = admin-managed, visible to all but only admins can assign.
    visibility: fileTagVisibilityEnum("visibility").notNull().default("public"),

    description: text("description"), // Explain what this tag means or when to use it.
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_file_tags_visibility").on(table.visibility),
  ]
);
