// comment_votes: User upvotes and downvotes on comments.
// See README.md for full design rationale.
import { pgTable, uuid, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { comments } from "./comments";

export const commentVotes = pgTable("comment_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  commentId: uuid("comment_id").notNull().references(() => comments.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(), // FK → users.id (cascade delete)
  value: integer("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("uq_comment_votes_comment_id_user_id").on(table.commentId, table.userId),
  index("idx_comment_votes_user_id").on(table.userId),
]);
