// mutes: Temporary or permanent muting of other users.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const mutes = pgTable(
  "mutes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    muterId: uuid("muter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mutedId: uuid("muted_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_mutes_muter_muted").on(table.muterId, table.mutedId),
    index("idx_mutes_muted_id").on(table.mutedId),
    index("idx_mutes_expires_at").on(table.expiresAt),
  ]
);
