// recipe_tags: Many-to-many join linking recipes to tags.
// See README.md for full design rationale.

import { pgTable, uuid, unique, index } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";
import { tags } from "./tags";

export const recipeTags = pgTable(
  "recipe_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("uq_recipe_tags_recipe_id_tag_id").on(table.recipeId, table.tagId),
    index("idx_recipe_tags_tag_id").on(table.tagId),
  ]
);
