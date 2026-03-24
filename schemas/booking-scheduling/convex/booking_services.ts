// booking_services: services and addons selected for a specific booking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bookingServices = defineTable({
  bookingId: v.id("bookings"),
  serviceId: v.optional(v.id("services")),
  addonId: v.optional(v.id("service_addons")),
  serviceName: v.string(),
  duration: v.number(),
  price: v.optional(v.number()),
  currency: v.optional(v.string()),
  isPrimary: v.boolean(),
  position: v.number(),
})
  .index("by_booking_id", ["bookingId"])
  .index("by_service_id", ["serviceId"]);
