// file_share_links: URL-based sharing with optional password protection, expiry, and download tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_share_links = defineTable({
  // What the link accesses. Exactly one of targetFileId or targetFolderId must be set.
  targetType: v.union(v.literal("file"), v.literal("folder")),
  targetFileId: v.optional(v.id("files")), // Populated when targetType = 'file'.
  targetFolderId: v.optional(v.id("folders")), // Populated when targetType = 'folder'.

  createdBy: v.id("users"), // Who created this link. Restrict: don't delete users who created share links.

  token: v.string(), // URL-safe token for the share link (e.g., /s/{token}). Cryptographically secure.
  scope: v.union(
    v.literal("anyone"),
    v.literal("organization"),
    v.literal("specific_users")
  ),
  permission: v.union(
    v.literal("view"),
    v.literal("download"),
    v.literal("edit"),
    v.literal("upload")
  ),
  passwordHash: v.optional(v.string()), // Hashed — never store plaintext.
  expiresAt: v.optional(v.number()), // When the link expires. Null = never expires.
  maxDownloads: v.optional(v.number()), // Maximum downloads allowed. Null = unlimited.
  downloadCount: v.number(), // How many times the link has been used to download. Increment atomically.
  name: v.optional(v.string()), // Human-readable name (e.g., "Client review link").
  isActive: v.boolean(), // Disable a link without deleting it.
  updatedAt: v.number(),
  // no createdAt — Convex provides _creationTime
})
  .index("by_token", ["token"])
  .index("by_target_type_target_file_id", ["targetType", "targetFileId"])
  .index("by_target_type_target_folder_id", ["targetType", "targetFolderId"])
  .index("by_created_by", ["createdBy"])
  .index("by_expires_at", ["expiresAt"]);
