// workspaces: Top-level organizational unit for digital asset management.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const workspaces = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
  storageLimitBytes: v.optional(v.number()),
  storageUsedBytes: v.number(),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"]);
