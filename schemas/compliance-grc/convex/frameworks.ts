// frameworks: Compliance frameworks and standards adopted by an organization.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const frameworks = defineTable({
  orgId: v.optional(v.id("organizations")),
  name: v.string(),
  version: v.optional(v.string()),
  authority: v.optional(v.string()),
  description: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_organization_id", ["orgId"])
  .index("by_is_active", ["isActive"]);
