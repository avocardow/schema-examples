// polls: Polls attached to posts with configurable options and expiry.
// See README.md for full design rationale.
import { pgTable, uuid, boolean, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const polls = pgTable(
  "polls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    allowsMultiple: boolean("allows_multiple").notNull().default(false),
    options: jsonb("options").notNull(),
    voteCount: integer("vote_count").notNull().default(0),
    voterCount: integer("voter_count").notNull().default(0),
    closesAt: timestamp("closes_at", { withTimezone: true }),
    isClosed: boolean("is_closed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_polls_author_id").on(table.authorId),
    index("idx_polls_closes_at").on(table.closesAt),
  ]
);
