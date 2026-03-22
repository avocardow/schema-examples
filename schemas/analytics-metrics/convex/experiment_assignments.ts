// experiment_assignments: User-to-variant assignments.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const experiment_assignments = defineTable({
  experimentId: v.id("experiments"),
  variantId: v.id("experiment_variants"),
  userId: v.optional(v.id("users")),
  anonymousId: v.optional(v.string()),
  assignedAt: v.number(),
})
  .index("by_experiment_id_and_user_id", ["experimentId", "userId"])
  .index("by_experiment_id_and_variant_id", ["experimentId", "variantId"])
  .index("by_user_id", ["userId"])
  .index("by_assigned_at", ["assignedAt"]);
