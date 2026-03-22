// anonymous_ids: Maps anonymous IDs to known users.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const anonymous_ids = defineTable({
  anonymousId: v.string(),
  userId: v.id("users"),
  firstSeenAt: v.number(),
  identifiedAt: v.number(),
})
  .index("by_anonymous_id_and_user_id", ["anonymousId", "userId"])
  .index("by_user_id", ["userId"]);
