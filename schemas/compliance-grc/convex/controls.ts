// controls: Security and compliance controls mapped to frameworks and risks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const controls = defineTable({
  orgId: v.optional(v.id("organizations")),
  ownerId: v.optional(v.id("users")),
  identifier: v.optional(v.string()),
  title: v.string(),
  description: v.optional(v.string()),
  controlType: v.union(
    v.literal("preventive"),
    v.literal("detective"),
    v.literal("corrective"),
    v.literal("directive")
  ),
  category: v.union(
    v.literal("technical"),
    v.literal("administrative"),
    v.literal("physical")
  ),
  frequency: v.union(
    v.literal("continuous"),
    v.literal("daily"),
    v.literal("weekly"),
    v.literal("monthly"),
    v.literal("quarterly"),
    v.literal("annually"),
    v.literal("as_needed")
  ),
  status: v.union(
    v.literal("draft"),
    v.literal("active"),
    v.literal("inactive"),
    v.literal("deprecated")
  ),
  effectiveness: v.union(
    v.literal("effective"),
    v.literal("partially_effective"),
    v.literal("ineffective"),
    v.literal("not_assessed")
  ),
  implementationNotes: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_identifier", ["identifier"])
  .index("by_organization_id", ["orgId"])
  .index("by_owner_id", ["ownerId"])
  .index("by_status", ["status"])
  .index("by_control_type", ["controlType"])
  .index("by_category", ["category"]);
