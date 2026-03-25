// ticket_followers: users subscribed to updates on a specific ticket.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_followers = defineTable({
  ticketId: v.id("tickets"),
  userId: v.id("users"),
})
  .index("by_ticket_id_and_user_id", ["ticketId", "userId"])
  .index("by_user_id", ["userId"]);
