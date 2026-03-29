// recipe_instructions: Ordered preparation steps for each recipe with optional timing.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, unique } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";

export const recipeInstructions = pgTable(
  "recipe_instructions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    stepNumber: integer("step_number").notNull(),
    instruction: text("instruction").notNull(),
    sectionLabel: text("section_label"),
    timeMinutes: integer("time_minutes"),
  },
  (table) => [
    unique("uq_recipe_instructions_recipe_id_step_number").on(table.recipeId, table.stepNumber),
  ]
);
