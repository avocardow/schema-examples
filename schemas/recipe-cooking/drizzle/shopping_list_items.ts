// shopping_list_items: Individual items on a shopping list with check-off tracking.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, boolean, index } from "drizzle-orm/pg-core";
import { shoppingLists } from "./shopping_lists";
import { foods } from "./foods";
import { recipes } from "./recipes";
import { units } from "./units";

export const shoppingListItems = pgTable(
  "shopping_list_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shoppingListId: uuid("shopping_list_id").notNull().references(() => shoppingLists.id, { onDelete: "cascade" }),
    foodId: uuid("food_id").references(() => foods.id, { onDelete: "set null" }),
    recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "set null" }),
    quantity: numeric("quantity"),
    unitId: uuid("unit_id").references(() => units.id, { onDelete: "set null" }),
    customLabel: text("custom_label"),
    checked: boolean("checked").notNull().default(false),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    index("idx_shopping_list_items_shopping_list_id_checked").on(table.shoppingListId, table.checked),
    index("idx_shopping_list_items_food_id").on(table.foodId),
  ]
);
