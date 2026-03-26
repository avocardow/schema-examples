// compliance_tags: Reusable tags for categorizing compliance entities.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const complianceTags = defineTable({
  orgId: v.optional(v.id("organizations")),
  name: v.string(),
  color: v.optional(v.string()),
})
  .index("by_organization_id_and_name", ["orgId", "name"]);
