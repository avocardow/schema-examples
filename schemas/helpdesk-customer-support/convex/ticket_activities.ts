// ticket_activities: append-only audit trail of ticket changes for accountability and SLA debugging.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_activities = defineTable({
  ticketId: v.id("tickets"),
  userId: v.optional(v.id("users")),
  action: v.union(
    v.literal("created"),
    v.literal("updated"),
    v.literal("status_changed"),
    v.literal("priority_changed"),
    v.literal("assigned"),
    v.literal("escalated"),
    v.literal("reopened"),
    v.literal("resolved"),
    v.literal("closed"),
    v.literal("sla_breached")
  ),
  field: v.optional(v.string()),
  oldValue: v.optional(v.string()),
  newValue: v.optional(v.string()),
})
  .index("by_ticket_id_and_creation_time", ["ticketId"])
  .index("by_user_id", ["userId"]);
