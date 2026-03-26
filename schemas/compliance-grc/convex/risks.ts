// risks: Identified risks tracked through assessment, treatment, and monitoring.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const risks = defineTable({
  orgId: v.optional(v.id("organizations")),
  ownerId: v.optional(v.id("users")),
  identifier: v.optional(v.string()),
  title: v.string(),
  description: v.optional(v.string()),
  category: v.union(
    v.literal("strategic"),
    v.literal("operational"),
    v.literal("financial"),
    v.literal("compliance"),
    v.literal("reputational"),
    v.literal("technical"),
    v.literal("third_party")
  ),
  likelihood: v.number(),
  impact: v.number(),
  riskLevel: v.union(
    v.literal("critical"),
    v.literal("high"),
    v.literal("medium"),
    v.literal("low"),
    v.literal("very_low")
  ),
  treatment: v.union(
    v.literal("mitigate"),
    v.literal("accept"),
    v.literal("transfer"),
    v.literal("avoid")
  ),
  status: v.union(
    v.literal("identified"),
    v.literal("assessing"),
    v.literal("treating"),
    v.literal("monitoring"),
    v.literal("closed")
  ),
  dueDate: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_identifier", ["identifier"])
  .index("by_organization_id", ["orgId"])
  .index("by_owner_id", ["ownerId"])
  .index("by_category", ["category"])
  .index("by_risk_level", ["riskLevel"])
  .index("by_status", ["status"]);
