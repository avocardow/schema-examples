// password_history: tracks previously used password hashes to enforce reuse policies.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const passwordHistory = pgTable(
  "password_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    passwordHash: text("password_hash").notNull(), // Previous password hash. Compared against new passwords to prevent reuse.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(), // When this password was set (not when it was retired).
  },
  (table) => [
    index("idx_password_history_user_id_created_at").on(
      table.userId,
      table.createdAt
    ), // "Get last N passwords for this user" — ordered by recency.
  ]
);
