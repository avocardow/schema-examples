// storage_quotas: Per-entity storage limits and usage tracking for users, organizations, or buckets.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const storage_quotas = defineTable({
  entityType: v.union(
    v.literal("user"),
    v.literal("organization"),
    v.literal("bucket")
  ),
  entityId: v.string(), // Polymorphic — references users, organizations, or storage_buckets depending on entityType.

  quotaBytes: v.number(), // Storage limit in bytes. Enforced at upload time.
  usedBytes: v.number(), // Cached: total bytes consumed. Updated on upload/delete.
  fileCount: v.number(), // Cached: total file count. Updated on upload/delete.
  lastComputedAt: v.optional(v.number()), // When usage was last recomputed by a background job. Null = never recomputed.

  updatedAt: v.number(),
})
  .index("by_entity", ["entityType", "entityId"])
  .index("by_entity_type", ["entityType"]);
