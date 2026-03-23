// redirects: URL redirect rules for SEO preservation and link management.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const redirects = defineTable({
  sourcePath: v.string(),
  targetPath: v.string(),
  statusCode: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_source_path", ["sourcePath"])
  .index("by_is_active", ["isActive"]);
