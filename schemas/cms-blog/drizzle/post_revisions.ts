// post_revisions: Versioned snapshots of post content for revision history.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const postRevisions = pgTable("post_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  createdBy: uuid("created_by").notNull(), // FK → users.id (restrict delete)
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("uq_post_revisions_post_id_revision_number").on(table.postId, table.revisionNumber),
  index("idx_post_revisions_post_id_created_at").on(table.postId, table.createdAt),
]);
