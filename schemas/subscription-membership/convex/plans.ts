// plans: subscription plan definitions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const plans = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  isActive: v.boolean(),
  sortOrder: v.number(),
  metadata: v.optional(v.any()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_is_active", ["isActive"])
  .index("by_provider", ["providerType", "providerId"]);
