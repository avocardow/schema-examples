// programs: Affiliate/referral programs with commission rules and attribution settings.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const programs = defineTable({
  name: v.string(),
  slug: v.string(),
  description: v.optional(v.string()),
  status: v.union(v.literal("draft"), v.literal("active"), v.literal("paused"), v.literal("archived")),
  commissionType: v.union(v.literal("percentage"), v.literal("flat"), v.literal("hybrid")),
  commissionPercentage: v.optional(v.number()),
  commissionFlat: v.optional(v.number()),
  currency: v.string(),
  cookieDuration: v.number(),
  attributionModel: v.union(v.literal("first_touch"), v.literal("last_touch")),
  minPayout: v.number(),
  autoApprove: v.boolean(),
  isPublic: v.boolean(),
  termsUrl: v.optional(v.string()),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_status", ["status"])
  .index("by_created_by", ["createdBy"]);
