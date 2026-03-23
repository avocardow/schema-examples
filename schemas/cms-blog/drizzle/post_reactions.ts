// post_reactions: Emoji-style reactions on posts by authenticated users.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const reactionTypeEnum = pgEnum("reaction_type", ["like", "love", "clap", "insightful", "bookmark"]);

export const postReactions = pgTable("post_reactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(), // FK → users.id (cascade delete)
  reactionType: reactionTypeEnum("reaction_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("uq_post_reactions_post_id_user_id_reaction_type").on(table.postId, table.userId, table.reactionType),
  index("idx_post_reactions_user_id").on(table.userId),
  index("idx_post_reactions_post_id_reaction_type").on(table.postId, table.reactionType),
]);
