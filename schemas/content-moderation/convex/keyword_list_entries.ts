// keyword_list_entries: Individual words/phrases in keyword lists.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const keyword_list_entries = defineTable({
  listId: v.id("keyword_lists"), // Which keyword list this entry belongs to. Cascade: deleting a list removes all its entries.
  value: v.string(), // The word, phrase, or pattern to match against.
  matchType: v.union(v.literal("exact"), v.literal("contains"), v.literal("regex")), // How matching works: exact = full string, contains = substring, regex = pattern.
  isCaseSensitive: v.boolean(), // Whether matching is case-sensitive. Default false in app logic.
  addedBy: v.id("users"), // Who added this entry. Restrict: don't delete users who added entries.
  // no createdAt — Convex provides _creationTime
})
  .index("by_list_id", ["listId"])
  .index("by_list_value_match_type", ["listId", "value", "matchType"]);
