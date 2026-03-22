// file_activities: Audit trail for file and folder operations. Append-only — rows are never updated or deleted.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_activities = defineTable({
  actorId: v.id("users"), // Who performed the action. Restrict: don't delete users who have audit trail entries.

  action: v.union(
    v.literal("created"),
    v.literal("uploaded"),
    v.literal("updated"),
    v.literal("renamed"),
    v.literal("moved"),
    v.literal("copied"),
    v.literal("deleted"),
    v.literal("restored"),
    v.literal("shared"),
    v.literal("unshared"),
    v.literal("downloaded"),
    v.literal("locked"),
    v.literal("unlocked"),
    v.literal("commented"),
    v.literal("version_created")
  ),

  targetType: v.union(v.literal("file"), v.literal("folder")), // Whether the action was on a file or folder.
  targetId: v.string(), // The file or folder ID. Not a FK — target may be permanently deleted.
  targetName: v.string(), // Denormalized: file/folder name at the time of the action.

  details: v.optional(v.any()), // Action-specific context (e.g., moved: {from_folder_id, to_folder_id}).
  ipAddress: v.optional(v.string()), // Client IP address for security audit.

  // No updatedAt — activities are immutable (append-only).
  // No createdAt — Convex provides _creationTime.
})
  .index("by_actor_id", ["actorId"])
  .index("by_target", ["targetType", "targetId"])
  .index("by_action", ["action"])
  .index("by_creation_time", ["_creationTime"]);
