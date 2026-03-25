// tenant_features: Feature flags and entitlements per organization.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tenant_features = defineTable({
  organizationId: v.id("organizations"),
  featureId: v.id("features"),
  isEnabled: v.boolean(),
  limitValue: v.optional(v.number()),
  source: v.union(
    v.literal("plan"),
    v.literal("override"),
    v.literal("trial"),
    v.literal("custom")
  ),
  expiresAt: v.optional(v.number()),
  notes: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_organization_id_and_feature_id", ["organizationId", "featureId"])
  .index("by_feature_id", ["featureId"])
  .index("by_source", ["source"])
  .index("by_expires_at", ["expiresAt"]);
