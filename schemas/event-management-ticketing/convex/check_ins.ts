// check_ins: records of ticket holders checking in at events or sessions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const check_ins = defineTable({
  ticketId: v.id("tickets"),
  sessionId: v.optional(v.id("event_sessions")),
  checkedInBy: v.optional(v.id("users")),
  method: v.union(
    v.literal("qr_scan"),
    v.literal("manual"),
    v.literal("self_service"),
    v.literal("auto")
  ),
  checkedInAt: v.number(),
})
  .index("by_ticket_id", ["ticketId"])
  .index("by_session_id_checked_in_at", ["sessionId", "checkedInAt"]);
