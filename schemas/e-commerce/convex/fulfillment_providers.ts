// fulfillment_providers: External or internal services responsible for order fulfillment.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const fulfillmentProviders = defineTable({
  name: v.string(),
  code: v.string(),
  type: v.union(
    v.literal("manual"),
    v.literal("flat_rate"),
    v.literal("carrier_calculated"),
    v.literal("third_party")
  ),
  config: v.optional(v.any()),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_code", ["code"])
  .index("by_is_active", ["isActive"]);
