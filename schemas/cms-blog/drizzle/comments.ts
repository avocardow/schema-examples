// comments: Threaded user comments on posts with moderation status.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const commentStatusEnum = pgEnum("comment_status", ["pending", "approved", "rejected", "spam"]);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references((): any => comments.id, { onDelete: "cascade" }),
  authorId: uuid("author_id"), // FK → users.id (set null)
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  status: commentStatusEnum("status").notNull().default("pending"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_comments_post_id_status_created_at").on(table.postId, table.status, table.createdAt),
  index("idx_comments_parent_id").on(table.parentId),
  index("idx_comments_author_id").on(table.authorId),
]);
