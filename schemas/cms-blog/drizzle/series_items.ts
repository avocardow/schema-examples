// series_items: Ordered membership of posts within a series.
// See README.md for full design rationale.
import { pgTable, uuid, integer, unique, index } from "drizzle-orm/pg-core";
import { series } from "./series";
import { posts } from "./posts";

export const seriesItems = pgTable("series_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  seriesId: uuid("series_id").notNull().references(() => series.id, { onDelete: "cascade" }),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [
  unique("uq_series_items_series_id_post_id").on(table.seriesId, table.postId),
  index("idx_series_items_post_id").on(table.postId),
  index("idx_series_items_series_id_sort_order").on(table.seriesId, table.sortOrder),
]);
