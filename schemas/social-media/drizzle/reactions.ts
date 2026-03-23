// reactions: Typed reactions (like, love, etc.) on posts.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const reactionTypeEnum = pgEnum("reaction_type", ["like", "love", "celebrate", "insightful", "funny"]);

export const reactions = pgTable(
  "reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: reactionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_reactions_post_user_type").on(table.postId, table.userId, table.type),
    index("idx_reactions_user_id").on(table.userId),
  ]
);
