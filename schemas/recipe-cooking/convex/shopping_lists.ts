// shopping_lists: User-created grocery lists, optionally linked to a meal plan.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const shoppingLists = defineTable({
  name: v.string(),
  mealPlanId: v.optional(v.id("meal_plans")),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"])
  .index("by_meal_plan_id", ["mealPlanId"]);
