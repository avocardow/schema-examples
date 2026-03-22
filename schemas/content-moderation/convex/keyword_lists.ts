// keyword_lists: Managed word/phrase lists for auto-moderation.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const keyword_lists = defineTable({
  name: v.string(), // List name (e.g., "Profanity — English", "Competitor URLs").
  description: v.optional(v.string()), // What this list contains and how it's used.

  // blocklist = content matching these entries is blocked/flagged.
  // allowlist = entries that override blocklist matches.
  // watchlist = entries that flag content for review.
  listType: v.union(
    v.literal("blocklist"),
    v.literal("allowlist"),
    v.literal("watchlist")
  ),

  scope: v.union(v.literal("global"), v.literal("community")),
  scopeId: v.optional(v.string()), // Community ID. Null when scope = global.
  isEnabled: v.boolean(),

  createdBy: v.id("users"), // Who created this list. Restrict: don't delete users who own lists.
  updatedAt: v.number(),
})
  .index("by_scope_and_scope_id", ["scope", "scopeId"])
  .index("by_list_type", ["listType"])
  .index("by_is_enabled", ["isEnabled"]);
