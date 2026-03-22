// tax_rates: Regional tax rules applied to orders based on country, region, and product category.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taxRates = defineTable({
  name: v.string(),
  country: v.string(),
  region: v.optional(v.string()),
  rate: v.number(),
  category: v.optional(v.string()),
  isCompound: v.boolean(),
  isActive: v.boolean(),
  priority: v.number(),
  updatedAt: v.number(),
})
  .index("by_country_region", ["country", "region"])
  .index("by_category", ["category"])
  .index("by_isActive", ["isActive"]);
