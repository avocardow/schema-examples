// wishlists: Named, optionally public wish lists per user.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const wishlists = defineTable({
  userId: v.id("users"),
  name: v.string(),
  isPublic: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"]);
