// meal_plan_entries: Individual meal slots assigning recipes to dates within a meal plan.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, index } from "drizzle-orm/pg-core";
import { mealPlans } from "./meal_plans";
import { recipes } from "./recipes";

export const mealTypeEnum = pgEnum("meal_type", ["breakfast", "lunch", "dinner", "snack"]);

export const mealPlanEntries = pgTable(
  "meal_plan_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mealPlanId: uuid("meal_plan_id").notNull().references(() => mealPlans.id, { onDelete: "cascade" }),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    planDate: text("plan_date").notNull(),
    mealType: mealTypeEnum("meal_type").notNull(),
    servings: integer("servings"),
    note: text("note"),
  },
  (table) => [
    index("idx_meal_plan_entries_meal_plan_id_plan_date").on(table.mealPlanId, table.planDate),
    index("idx_meal_plan_entries_recipe_id").on(table.recipeId),
  ]
);
