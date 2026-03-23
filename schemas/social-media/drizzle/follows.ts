// follows: Directional follow relationships between users.
// See README.md for full design rationale.
import { pgTable, uuid, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const follows = pgTable(
  "follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    notify: boolean("notify").notNull().default(false),
    showReposts: boolean("show_reposts").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_follows_follower_following").on(table.followerId, table.followingId),
    index("idx_follows_following_id").on(table.followingId),
  ]
);
