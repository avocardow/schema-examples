// posts: User-authored content supporting replies, quotes, and threaded conversations.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { polls } from "./polls";

export const postContentTypeEnum = pgEnum("post_content_type", ["text", "system", "deleted"]);
export const postVisibilityEnum = pgEnum("post_visibility", ["public", "unlisted", "followers_only", "mentioned_only"]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content"),
    contentType: postContentTypeEnum("content_type").notNull().default("text"),
    replyToId: uuid("reply_to_id").references(() => posts.id, { onDelete: "set null" }),
    conversationId: uuid("conversation_id").references(() => posts.id, { onDelete: "set null" }),
    quoteOfId: uuid("quote_of_id").references(() => posts.id, { onDelete: "set null" }),
    visibility: postVisibilityEnum("visibility").notNull().default("public"),
    isEdited: boolean("is_edited").notNull().default(false),
    editedAt: timestamp("edited_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    replyCount: integer("reply_count").notNull().default(0),
    reactionCount: integer("reaction_count").notNull().default(0),
    repostCount: integer("repost_count").notNull().default(0),
    pollId: uuid("poll_id").references(() => polls.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_posts_author_id_created_at").on(table.authorId, table.createdAt),
    index("idx_posts_reply_to_id").on(table.replyToId),
    index("idx_posts_conversation_id_created_at").on(table.conversationId, table.createdAt),
    index("idx_posts_visibility_created_at").on(table.visibility, table.createdAt),
    index("idx_posts_expires_at").on(table.expiresAt),
    index("idx_posts_quote_of_id").on(table.quoteOfId),
  ]
);
