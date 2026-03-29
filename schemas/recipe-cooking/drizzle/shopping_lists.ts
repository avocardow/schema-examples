// shopping_lists: Named grocery lists optionally linked to a meal plan.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { mealPlans } from "./meal_plans";
import { users } from "../../auth-rbac/drizzle/users";

export const shoppingLists = pgTable(
  "shopping_lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    mealPlanId: uuid("meal_plan_id").references(() => mealPlans.id, { onDelete: "set null" }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_shopping_lists_created_by").on(table.createdBy),
    index("idx_shopping_lists_meal_plan_id").on(table.mealPlanId),
  ]
);
