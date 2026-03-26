// ticket_transfers: ownership transfer records when tickets change holders.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_transfers = defineTable({
  ticketId: v.id("tickets"),
  fromUserId: v.optional(v.id("users")),
  fromName: v.string(),
  fromEmail: v.string(),
  toUserId: v.optional(v.id("users")),
  toName: v.string(),
  toEmail: v.string(),
  transferredAt: v.number(),
  notes: v.optional(v.string()),
})
  .index("by_ticket_id", ["ticketId"])
  .index("by_from_user_id", ["fromUserId"])
  .index("by_to_user_id", ["toUserId"]);
