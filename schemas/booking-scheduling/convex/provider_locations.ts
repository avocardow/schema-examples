// provider_locations: junction table linking providers to their service locations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const providerLocations = defineTable({
  providerId: v.id("providers"),
  locationId: v.id("locations"),
  isPrimary: v.boolean(),
})
  .index("by_provider_id_location_id", ["providerId", "locationId"])
  .index("by_location_id", ["locationId"]);
