// permissions: Granular capabilities using a "resource:action" naming convention.
// Assigned to roles (not directly to users).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const permissions = defineTable({
  slug: v.string(), // Structured key: "resource:action" (e.g., "posts:create", "users:delete").
  name: v.string(), // Display name (e.g., "Create Posts").
  description: v.optional(v.string()),
  resourceType: v.optional(v.string()), // Groups permissions by resource (e.g., "posts", "users").
})
  .index("by_slug", ["slug"])
  .index("by_resource_type", ["resourceType"]);
