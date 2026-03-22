// import_export_jobs: Bulk import/export operations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const import_export_jobs = defineTable({
  type: v.union(v.literal("import"), v.literal("export")),
  format: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("completed"),
    v.literal("failed")
  ),
  localeId: v.optional(v.id("locales")),
  namespaceId: v.optional(v.id("namespaces")),
  filePath: v.optional(v.string()),
  totalCount: v.number(), // Default 0.
  processedCount: v.number(), // Default 0.
  errorMessage: v.optional(v.string()),
  options: v.optional(v.any()),
  createdBy: v.optional(v.id("users")),
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_status", ["status"])
  .index("by_created_by", ["createdBy"])
  .index("by_type_and_status", ["type", "status"]);
