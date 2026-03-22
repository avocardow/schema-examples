// currencies: Supported monetary currencies with exchange rates for multi-currency pricing.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const currencies = defineTable({
  code: v.string(),
  name: v.string(),
  symbol: v.string(),
  decimalPlaces: v.number(),
  exchangeRate: v.number(),
  isBase: v.boolean(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_code", ["code"])
  .index("by_isActive", ["isActive"]);
