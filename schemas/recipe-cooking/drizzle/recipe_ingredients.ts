// recipe_ingredients: Ingredient lines linking recipes to foods with quantities and ordering.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, boolean, index } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";
import { foods } from "./foods";
import { units } from "./units";

export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    foodId: uuid("food_id").notNull().references(() => foods.id, { onDelete: "restrict" }),
    unitId: uuid("unit_id").references(() => units.id, { onDelete: "set null" }),
    quantity: numeric("quantity"),
    note: text("note"),
    sectionLabel: text("section_label"),
    position: integer("position").notNull().default(0),
    optional: boolean("optional").notNull().default(false),
  },
  (table) => [
    index("idx_recipe_ingredients_recipe_id_position").on(table.recipeId, table.position),
    index("idx_recipe_ingredients_food_id").on(table.foodId),
  ]
);
