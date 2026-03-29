// recipe_activities: Audit log of user actions on recipes for activity feeds.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipeActivities = defineTable({
  recipeId: v.optional(v.id("recipes")),
  actorId: v.id("users"),
  action: v.union(
    v.literal("created"),
    v.literal("updated"),
    v.literal("published"),
    v.literal("archived"),
    v.literal("rated"),
    v.literal("favorited"),
    v.literal("added_to_collection"),
    v.literal("added_to_meal_plan")
  ),
  details: v.optional(v.any()),
  occurredAt: v.number(),
})
  .index("by_recipe_id", ["recipeId"])
  .index("by_actor_id", ["actorId"])
  .index("by_action", ["action"])
  .index("by_occurred_at", ["occurredAt"]);
