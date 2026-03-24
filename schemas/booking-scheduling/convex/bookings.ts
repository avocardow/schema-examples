// bookings: core appointment records tracking provider-customer meetings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookings = defineTable({
  providerId: v.id("providers"),
  locationId: v.optional(v.id("locations")),
  customerId: v.id("users"),
  scheduleId: v.optional(v.id("schedules")),
  startTime: v.number(),
  endTime: v.number(),
  timezone: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("completed"),
    v.literal("cancelled"),
    v.literal("declined"),
    v.literal("no_show")
  ),
  cancelledBy: v.optional(v.id("users")),
  cancellationReason: v.optional(v.string()),
  cancelledAt: v.optional(v.number()),
  customerNotes: v.optional(v.string()),
  providerNotes: v.optional(v.string()),
  source: v.union(
    v.literal("online"),
    v.literal("manual"),
    v.literal("api"),
    v.literal("import")
  ),
  paymentStatus: v.union(
    v.literal("not_required"),
    v.literal("pending"),
    v.literal("paid"),
    v.literal("refunded"),
    v.literal("partially_refunded")
  ),
  recurrenceGroupId: v.optional(v.string()),
  recurrenceRule: v.optional(v.string()),
  confirmedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_provider_id_start_time", ["providerId", "startTime"])
  .index("by_customer_id_start_time", ["customerId", "startTime"])
  .index("by_status", ["status"])
  .index("by_start_time_end_time", ["startTime", "endTime"])
  .index("by_location_id", ["locationId"])
  .index("by_recurrence_group_id", ["recurrenceGroupId"]);
