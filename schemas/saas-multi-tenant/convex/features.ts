// features: Feature flags and metered capabilities for plan gating.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const features = defineTable({
  key: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  featureType: v.union(
    v.literal("boolean"),
    v.literal("limit"),
    v.literal("metered"),
  ),
  unit: v.optional(v.string()),
  isEnabled: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_key", ["key"])
  .index("by_feature_type", ["featureType"])
  .index("by_is_enabled", ["isEnabled"]);
