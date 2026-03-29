// collection_recipes: Many-to-many join linking collections to recipes with ordering.
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { collections } from "./collections";
import { recipes } from "./recipes";

export const collectionRecipes = pgTable(
  "collection_recipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collectionId: uuid("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_collection_recipes_collection_id_recipe_id").on(table.collectionId, table.recipeId),
    index("idx_collection_recipes_recipe_id").on(table.recipeId),
  ]
);
