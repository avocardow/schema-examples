// file_locks: Collaborative file locking to prevent concurrent edits — one lock per file.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_locks = defineTable({
  fileId: v.id("files"), // The locked file. UNIQUE: only one lock per file at a time. Cascade: deleting a file releases its lock.
  lockedBy: v.id("users"), // Who holds the lock. Cascade: deleting a user releases their locks.
  lockType: v.union(v.literal("exclusive"), v.literal("shared")), // exclusive = only lock holder can edit. shared = cooperative read-only mode.
  reason: v.optional(v.string()), // Why the file is locked (e.g., "Editing in Word", "Under review").
  expiresAt: v.optional(v.number()), // When the lock automatically expires. Null = indefinite.
  // no createdAt — Convex provides _creationTime
  // no updatedAt — locks are short-lived; to extend, release and re-acquire.
})
  .index("by_file_id", ["fileId"])
  .index("by_locked_by", ["lockedBy"])
  .index("by_expires_at", ["expiresAt"]);
