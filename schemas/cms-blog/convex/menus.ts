// menus: Named navigation menus for header, footer, and sidebar placement.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const menus = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"]);
