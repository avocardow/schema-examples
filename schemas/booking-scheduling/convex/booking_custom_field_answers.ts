// booking_custom_field_answers: customer responses to custom intake fields on a booking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookingCustomFieldAnswers = defineTable({
  bookingId: v.id("bookings"),
  customFieldId: v.id("custom_fields"),
  value: v.string(),
})
  .index("by_booking_id_custom_field_id", ["bookingId", "customFieldId"])
  .index("by_custom_field_id", ["customFieldId"]);
