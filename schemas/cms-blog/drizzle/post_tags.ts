// post_tags: Many-to-many link between posts and tags with ordering.
// See README.md for full design rationale.
import { pgTable, uuid, integer, unique, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { tags } from "./tags";

export const postTags = pgTable("post_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [
  unique("uq_post_tags_post_id_tag_id").on(table.postId, table.tagId),
  index("idx_post_tags_tag_id").on(table.tagId),
]);
