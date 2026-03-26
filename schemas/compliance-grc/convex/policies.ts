// policies: Governance policies, standards, procedures, and guidelines.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const policies = defineTable({
  orgId: v.optional(v.id("organizations")),
  ownerId: v.optional(v.id("users")),
  title: v.string(),
  policyType: v.union(
    v.literal("policy"),
    v.literal("standard"),
    v.literal("procedure"),
    v.literal("guideline")
  ),
  description: v.optional(v.string()),
  reviewFrequency: v.union(
    v.literal("monthly"),
    v.literal("quarterly"),
    v.literal("semi_annually"),
    v.literal("annually"),
    v.literal("biennially")
  ),
  nextReviewDate: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_organization_id", ["orgId"])
  .index("by_owner_id", ["ownerId"])
  .index("by_policy_type", ["policyType"])
  .index("by_is_active", ["isActive"]);
