// Association between shows and categories with primary category flag
// See README.md for full design rationale.

import { pgTable, uuid, boolean, unique, index } from "drizzle-orm/pg-core";
import { shows } from "./shows";
import { categories } from "./categories";

export const showCategories = pgTable(
  "show_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => [
    unique("uq_show_categories_show_id_category_id").on(table.showId, table.categoryId),
    index("idx_show_categories_category_id").on(table.categoryId),
  ]
);
