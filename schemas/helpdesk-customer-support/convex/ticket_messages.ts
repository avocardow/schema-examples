// ticket_messages: replies, internal notes, and system messages within a ticket thread.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_messages = defineTable({
  ticketId: v.id("tickets"),
  senderId: v.optional(v.id("users")),
  type: v.union(
    v.literal("reply"),
    v.literal("note"),
    v.literal("customer_message"),
    v.literal("system")
  ),
  body: v.string(),
  isPrivate: v.boolean(),
  channel: v.union(
    v.literal("email"),
    v.literal("web"),
    v.literal("api"),
    v.literal("system")
  ),
})
  .index("by_ticket_id_and_creation_time", ["ticketId", "_creationTime"])
  .index("by_sender_id", ["senderId"]);
