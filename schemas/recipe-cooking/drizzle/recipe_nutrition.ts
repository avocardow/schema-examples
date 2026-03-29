// recipe_nutrition: Per-recipe macronutrient and micronutrient summary values.
// See README.md for full design rationale.

import { pgTable, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";

export const recipeNutrition = pgTable(
  "recipe_nutrition",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").notNull().unique().references(() => recipes.id, { onDelete: "cascade" }),
    calories: numeric("calories"),
    totalFatGrams: numeric("total_fat_grams"),
    saturatedFatGrams: numeric("saturated_fat_grams"),
    carbohydratesGrams: numeric("carbohydrates_grams"),
    fiberGrams: numeric("fiber_grams"),
    sugarGrams: numeric("sugar_grams"),
    proteinGrams: numeric("protein_grams"),
    sodiumMg: numeric("sodium_mg"),
    cholesterolMg: numeric("cholesterol_mg"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);
