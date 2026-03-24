// waitlist_entries: customers waiting for availability on a specific service and date.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const waitlistEntries = defineTable({
  serviceId: v.id("services"),
  providerId: v.optional(v.id("providers")),
  customerId: v.id("users"),
  locationId: v.optional(v.id("locations")),
  preferredDate: v.string(),
  preferredStart: v.optional(v.string()),
  preferredEnd: v.optional(v.string()),
  status: v.union(
    v.literal("waiting"),
    v.literal("notified"),
    v.literal("booked"),
    v.literal("expired"),
    v.literal("cancelled")
  ),
  notifiedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  notes: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_service_id_preferred_date_status", ["serviceId", "preferredDate", "status"])
  .index("by_customer_id_status", ["customerId", "status"])
  .index("by_status_notified_at", ["status", "notifiedAt"]);
