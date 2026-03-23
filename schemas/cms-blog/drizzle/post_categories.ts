// post_categories: Many-to-many link between posts and categories.
// See README.md for full design rationale.
import { pgTable, uuid, unique, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { categories } from "./categories";

export const postCategories = pgTable("post_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (table) => [
  unique("uq_post_categories_post_id_category_id").on(table.postId, table.categoryId),
  index("idx_post_categories_category_id").on(table.categoryId),
]);
