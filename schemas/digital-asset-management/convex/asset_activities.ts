// asset_activities: Audit trail of all actions performed on assets.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const assetActivities = defineTable({
  workspaceId: v.id("workspaces"),
  assetId: v.optional(v.id("assets")),
  actorId: v.id("users"),
  action: v.union(
    v.literal("uploaded"),
    v.literal("updated"),
    v.literal("downloaded"),
    v.literal("shared"),
    v.literal("commented"),
    v.literal("tagged"),
    v.literal("moved"),
    v.literal("versioned"),
    v.literal("archived"),
    v.literal("restored"),
    v.literal("deleted")
  ),
  details: v.optional(v.any()),
})
  .index("by_workspace_id", ["workspaceId"])
  .index("by_asset_id", ["assetId"])
  .index("by_actor_id", ["actorId"])
  .index("by_action", ["action"])
  .index("by_creation_time", ["_creationTime"]);
