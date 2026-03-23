// message_read_receipts: Per-message delivery and read tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const message_read_receipts = defineTable({
  messageId: v.id("messages"),
  userId: v.id("users"),
  deliveredAt: v.optional(v.number()),
  readAt: v.optional(v.number()),
})
  .index("by_message_id_and_user_id", ["messageId", "userId"])
  .index("by_user_id_and_read_at", ["userId", "readAt"]);
