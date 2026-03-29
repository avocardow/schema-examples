// recipes: Core table storing recipe metadata, timing, and publication status.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const recipes = defineTable({
  title: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  sourceUrl: v.optional(v.string()),
  sourceName: v.optional(v.string()),
  servings: v.optional(v.string()),
  prepTimeMinutes: v.optional(v.number()),
  cookTimeMinutes: v.optional(v.number()),
  totalTimeMinutes: v.optional(v.number()),
  difficulty: v.optional(
    v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))
  ),
  status: v.union(
    v.literal("draft"),
    v.literal("published"),
    v.literal("archived")
  ),
  language: v.optional(v.string()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_created_by", ["createdBy"])
  .index("by_status", ["status"])
  .index("by_difficulty", ["difficulty"]);
