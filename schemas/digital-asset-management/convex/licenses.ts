// licenses: Defines reusable license templates for asset usage rights.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const licenses = defineTable({
  workspaceId: v.id("workspaces"),
  name: v.string(),
  description: v.optional(v.string()),
  licenseType: v.union(
    v.literal("royalty_free"),
    v.literal("rights_managed"),
    v.literal("editorial"),
    v.literal("creative_commons"),
    v.literal("internal"),
    v.literal("custom")
  ),
  territories: v.optional(v.any()),
  channels: v.optional(v.any()),
  maxUses: v.optional(v.number()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_workspace_id", ["workspaceId"])
  .index("by_license_type", ["licenseType"]);
