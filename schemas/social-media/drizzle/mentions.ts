// mentions: Records of users mentioned in posts.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const mentions = pgTable(
  "mentions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    mentionedUserId: uuid("mentioned_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_mentions_post_mentioned_user").on(table.postId, table.mentionedUserId),
    index("idx_mentions_mentioned_user_id_created_at").on(table.mentionedUserId, table.createdAt),
  ]
);
