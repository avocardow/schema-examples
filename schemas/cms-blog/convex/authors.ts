// authors: Author profiles linked to user accounts.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const authors = defineTable({
  userId: v.id("users"),
  displayName: v.string(),
  slug: v.string(),
  bio: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  socialLinks: v.optional(v.any()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_user_id", ["userId"]);
