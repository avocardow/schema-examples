// policy_versions: Versioned snapshots of policy content with approval workflow.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const policyVersions = defineTable({
  policyId: v.id("policies"),
  versionNumber: v.string(),
  content: v.optional(v.string()),
  fileId: v.optional(v.id("files")),
  status: v.union(
    v.literal("draft"),
    v.literal("in_review"),
    v.literal("approved"),
    v.literal("archived")
  ),
  approvedBy: v.optional(v.id("users")),
  approvedAt: v.optional(v.number()),
  effectiveDate: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_policy_id_and_version_number", ["policyId", "versionNumber"])
  .index("by_status", ["status"])
  .index("by_approved_by", ["approvedBy"]);
