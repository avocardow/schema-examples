// policy_acknowledgments: Records of users acknowledging policy versions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const policyAcknowledgments = defineTable({
  policyVersionId: v.id("policy_versions"),
  userId: v.id("users"),
  acknowledgedAt: v.number(),
  method: v.union(
    v.literal("click_through"),
    v.literal("electronic_signature"),
    v.literal("manual")
  ),
  ipAddress: v.optional(v.string()),
  notes: v.optional(v.string()),
})
  .index("by_policy_version_id_and_user_id", ["policyVersionId", "userId"])
  .index("by_user_id", ["userId"])
  .index("by_acknowledged_at", ["acknowledgedAt"]);
