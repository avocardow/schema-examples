// blocks: user-to-user blocking relationships to restrict interactions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const blocks = defineTable({
  blockerId: v.id("users"),
  blockedId: v.id("users"),
})
  .index("by_blocker_id_blocked_id", ["blockerId", "blockedId"])
  .index("by_blocked_id", ["blockedId"]);
