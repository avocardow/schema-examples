// folders: Folder tree with materialized path for efficient subtree queries.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const folders = defineTable({
  bucketId: v.id("storage_buckets"), // Which bucket this folder belongs to.
  parentId: v.optional(v.id("folders")), // Parent folder. Null = root-level folder within the bucket.
  name: v.string(), // Display name (e.g., "Documents", "Photos 2024").

  // Materialized path using folder IDs as segments.
  // Format: /{parent_uuid}/{this_uuid}/ (e.g., "/abc123/def456/").
  // Root folders: /{this_uuid}/
  // Enables subtree queries: WHERE path LIKE '/abc123/%'
  // Uses UUIDs (not names) so folder renames don't cascade path updates.
  path: v.string(),

  depth: v.number(), // Hierarchy level. 0 = root, 1 = child of root, etc.
  description: v.optional(v.string()),
  createdBy: v.id("users"), // Who created this folder. Restrict: don't delete users who own folders.
  updatedAt: v.number(),
})
  .index("by_bucket_id_path", ["bucketId", "path"])
  .index("by_bucket_id_parent_id_name", ["bucketId", "parentId", "name"])
  .index("by_parent_id", ["parentId"])
  .index("by_bucket_id_depth", ["bucketId", "depth"]);
