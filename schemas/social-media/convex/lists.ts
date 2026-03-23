// lists: curated collections of users for organized timeline viewing.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const lists = defineTable({
  ownerId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  isPrivate: v.boolean(),
  memberCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_owner_id", ["ownerId"]);
