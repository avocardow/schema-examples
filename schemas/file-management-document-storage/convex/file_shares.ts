// file_shares: Direct access grants to specific users, groups, or organizations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_shares = defineTable({
  // What is being shared. Exactly one of targetFileId or targetFolderId must be set.
  targetType: v.union(v.literal("file"), v.literal("folder")), // Discriminator for which FK is populated.
  targetFileId: v.optional(v.id("files")), // Populated when targetType = 'file'. Cascade: deleting the file removes all its shares.
  targetFolderId: v.optional(v.id("folders")), // Populated when targetType = 'folder'. Cascade: deleting the folder removes all its shares.

  sharedBy: v.id("users"), // Who created this share. Restrict: don't delete users who have active shares.

  // Who the share is granted to. The sharedWithId references different tables depending on type.
  sharedWithType: v.union(v.literal("user"), v.literal("group"), v.literal("organization")),
  sharedWithId: v.string(), // Polymorphic — not a FK. Target depends on sharedWithType.

  role: v.union(v.literal("viewer"), v.literal("commenter"), v.literal("editor"), v.literal("co_owner")),
  allowReshare: v.boolean(), // Whether the recipient can share this item with others.
  expiresAt: v.optional(v.number()), // Unix epoch. Null = never expires.
  acceptedAt: v.optional(v.number()), // Unix epoch. Null = pending acceptance.
  message: v.optional(v.string()), // Optional message to the recipient.
  updatedAt: v.number(),
  // no createdAt — Convex provides _creationTime
})
  .index("by_target_file", ["targetType", "targetFileId"])
  .index("by_target_folder", ["targetType", "targetFolderId"])
  .index("by_shared_with", ["sharedWithType", "sharedWithId"])
  .index("by_shared_by", ["sharedBy"])
  .index("by_expires_at", ["expiresAt"]);
