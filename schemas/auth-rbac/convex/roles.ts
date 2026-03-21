// roles: Named sets of permissions. Uses human-readable slugs and two-tier scoping
// (environment-level vs organization-scoped).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const roles = defineTable({
  slug: v.string(), // Human-readable key (e.g., "admin", "org:editor").
  name: v.string(), // Display name for admin UIs.
  description: v.optional(v.string()),

  // "environment" = app-wide. "organization" = only within an org.
  scope: v.union(v.literal("environment"), v.literal("organization")),

  isSystem: v.boolean(), // System roles cannot be deleted.
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_scope", ["scope"]);
