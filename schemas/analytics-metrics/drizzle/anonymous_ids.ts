// anonymous_ids: Mapping of anonymous visitor IDs to identified user accounts.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const anonymousIds = pgTable(
  "anonymous_ids",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    anonymousId: text("anonymous_id").notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull(),
    identifiedAt: timestamp("identified_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_anonymous_ids_anonymous_id_user_id").on(table.anonymousId, table.userId),
    index("idx_anonymous_ids_user_id").on(table.userId),
  ]
);
