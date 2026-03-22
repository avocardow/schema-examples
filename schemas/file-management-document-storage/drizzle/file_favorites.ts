// file_favorites: Per-user file bookmarks (stars) for "starred files" UIs.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "../../auth-rbac/drizzle/users";

export const fileFavorites = pgTable(
  "file_favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_file_favorites_user_file").on(table.userId, table.fileId),
    index("idx_file_favorites_file_id").on(table.fileId),
  ]
);
