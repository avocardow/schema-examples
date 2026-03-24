// booking_attendees: individual participants attached to a booking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookingAttendees = defineTable({
  bookingId: v.id("bookings"),
  userId: v.optional(v.id("users")),
  name: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  status: v.union(
    v.literal("confirmed"),
    v.literal("cancelled"),
    v.literal("no_show")
  ),
  cancelledAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_booking_id", ["bookingId"])
  .index("by_user_id", ["userId"])
  .index("by_email", ["email"]);
