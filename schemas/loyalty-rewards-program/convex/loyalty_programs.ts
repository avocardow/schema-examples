// loyalty_programs: Top-level loyalty program configuration with currency, earning, and expiration settings.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const loyaltyPrograms = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  status: v.union(
    v.literal("draft"),
    v.literal("active"),
    v.literal("paused"),
    v.literal("archived")
  ),
  currencyName: v.string(),
  pointsPerCurrency: v.number(),
  currency: v.optional(v.string()),
  pointsExpiryDays: v.optional(v.number()),
  allowNegative: v.boolean(),
  isPublic: v.boolean(),
  termsUrl: v.optional(v.string()),
  metadata: v.optional(v.any()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_status", ["status"])
  .index("by_created_by", ["createdBy"]);
