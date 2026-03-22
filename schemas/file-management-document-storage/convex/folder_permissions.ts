// folder_permissions: Per-user permission grants on folders, supporting inherited and directly assigned access.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const folder_permissions = defineTable({
  folderId: v.id("folders"), // The folder this permission applies to. Cascade: deleting the folder removes its permissions.
  userId: v.string(), // External user identifier. Cascade: deleting the user removes their permissions.
  permission: v.union(v.literal("view"), v.literal("edit"), v.literal("manage")), // Access level granted; defaults to 'view' at the app layer.
  inherited: v.boolean(), // Whether this permission was inherited from a parent folder rather than directly assigned.
  grantedBy: v.optional(v.string()), // External user identifier of the granter. Null if system-generated. Set null on granter deletion.
  updatedAt: v.number(), // Unix epoch. Managed by the application on every mutation.
  // no createdAt — Convex provides _creationTime
})
  .index("by_folder_id_and_user_id", ["folderId", "userId"])
  .index("by_user_id", ["userId"])
  .index("by_folder_id", ["folderId"]);
