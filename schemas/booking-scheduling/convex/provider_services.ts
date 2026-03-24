// provider_services: junction table linking providers to the services they offer.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const providerServices = defineTable({
  providerId: v.id("providers"),
  serviceId: v.id("services"),
  customPrice: v.optional(v.number()),
  customDuration: v.optional(v.number()),
  isActive: v.boolean(),
})
  .index("by_provider_id_service_id", ["providerId", "serviceId"])
  .index("by_service_id", ["serviceId"]);
