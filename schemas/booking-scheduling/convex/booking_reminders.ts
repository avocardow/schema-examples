// booking_reminders: scheduled notification reminders for upcoming bookings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookingReminders = defineTable({
  bookingId: v.id("bookings"),
  remindAt: v.number(),
  type: v.union(
    v.literal("customer"),
    v.literal("provider"),
    v.literal("all")
  ),
  offsetMinutes: v.number(),
  status: v.union(
    v.literal("pending"),
    v.literal("sent"),
    v.literal("failed"),
    v.literal("cancelled")
  ),
  sentAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_booking_id", ["bookingId"])
  .index("by_status_remind_at", ["status", "remindAt"]);
