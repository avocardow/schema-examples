// list_members: Users added to curated lists.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { lists } from "./lists";
import { users } from "./users";

export const listMembers = pgTable(
  "list_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_list_members_list_user").on(table.listId, table.userId),
    index("idx_list_members_user_id").on(table.userId),
  ]
);
