// waitlist_entries: queued requests for sold-out events or ticket types.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const waitlist_entries = defineTable({
  eventId: v.id("events"),
  ticketTypeId: v.optional(v.id("ticket_types")),
  userId: v.optional(v.id("users")),
  name: v.string(),
  email: v.string(),
  quantity: v.number(),
  status: v.union(
    v.literal("waiting"),
    v.literal("notified"),
    v.literal("converted"),
    v.literal("expired"),
    v.literal("cancelled")
  ),
  notifiedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_event_id_ticket_type_id_status", ["eventId", "ticketTypeId", "status"])
  .index("by_user_id", ["userId"])
  .index("by_email_status", ["email", "status"])
  .index("by_status_notified_at", ["status", "notifiedAt"]);
