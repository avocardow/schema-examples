// ticket_feedback: post-resolution satisfaction rating and optional comment per ticket.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_feedback = defineTable({
  ticketId: v.id("tickets"),
  rating: v.union(v.literal("good"), v.literal("bad")),
  comment: v.optional(v.string()),
  createdById: v.id("users"),
})
  .index("by_ticket_id", ["ticketId"])
  .index("by_rating", ["rating"])
  .index("by_created_by_id", ["createdById"]);
