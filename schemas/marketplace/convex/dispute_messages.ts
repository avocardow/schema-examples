// dispute_messages: Threaded communication between parties in a dispute.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const disputeMessages = defineTable({
  disputeId: v.id("disputes"),
  senderId: v.id("users"),
  senderRole: v.union(
    v.literal("customer"),
    v.literal("vendor"),
    v.literal("admin")
  ),
  body: v.string(),
  attachments: v.optional(v.any()),
})
  .index("by_dispute_id_created", ["disputeId", "_creationTime"]);
