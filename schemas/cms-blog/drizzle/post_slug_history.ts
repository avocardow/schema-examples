// post_slug_history: Tracks previous slugs for permanent redirect support.
// See README.md for full design rationale.
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const postSlugHistory = pgTable("post_slug_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_post_slug_history_post_id").on(table.postId),
]);
