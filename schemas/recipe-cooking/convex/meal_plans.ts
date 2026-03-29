// meal_plans: Named date-range plans for organizing meals across days.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mealPlans = defineTable({
  name: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"]);
