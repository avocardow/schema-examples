// file_locks: Collaborative file locking to prevent concurrent edits — one lock per file.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "../../auth-rbac/drizzle/users";

export const lockTypeEnum = pgEnum("lock_type", ["exclusive", "shared"]);

export const fileLocks = pgTable(
  "file_locks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileId: uuid("file_id")
      .unique()
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    lockedBy: uuid("locked_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lockType: lockTypeEnum("lock_type").notNull().default("exclusive"),
    reason: text("reason"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // No updatedAt — locks are short-lived; to extend, release and re-acquire.
  },
  (table) => [
    index("idx_file_locks_locked_by").on(table.lockedBy),
    index("idx_file_locks_expires_at").on(table.expiresAt),
  ]
);
