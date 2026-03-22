// file_tags: Tag definitions for organizing files with visibility levels (public, private, system).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_tags = defineTable({
  name: v.string(), // Tag name (e.g., "important", "reviewed", "needs-update").
  color: v.optional(v.string()), // Hex color for UI display (e.g., "#ff5733").

  // public = visible to all users.
  // private = visible only to the creator.
  // system = admin-managed, visible to all but only admins can assign.
  visibility: v.union(
    v.literal("public"),
    v.literal("private"),
    v.literal("system")
  ),

  description: v.optional(v.string()), // Explain what this tag means or when to use it.
  createdBy: v.id("users"), // Who created this tag. Restrict: don't delete users who own tags.
})
  .index("by_name", ["name"])
  .index("by_visibility", ["visibility"]);
