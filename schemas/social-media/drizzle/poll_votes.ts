// poll_votes: Individual vote records for poll options.
// See README.md for full design rationale.
import { pgTable, uuid, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { polls } from "./polls";
import { users } from "./users";

export const pollVotes = pgTable(
  "poll_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    optionIndex: integer("option_index").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_poll_votes_poll_user_option").on(table.pollId, table.userId, table.optionIndex),
    index("idx_poll_votes_user_id").on(table.userId),
  ]
);
