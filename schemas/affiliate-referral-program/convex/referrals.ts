// referrals: Tracks each referral from an affiliate, from initial visit through conversion or expiry.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const referrals = defineTable({
  affiliateId: v.id("affiliates"),
  clickId: v.optional(v.id("clicks")),
  visitorId: v.optional(v.string()),
  email: v.optional(v.string()),
  status: v.union(v.literal("visit"), v.literal("lead"), v.literal("converted"), v.literal("expired")),
  landingUrl: v.optional(v.string()),
  metadata: v.optional(v.any()),
  convertedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_affiliate_id_and_status", ["affiliateId", "status"])
  .index("by_status", ["status"])
  .index("by_email", ["email"])
  .index("by_visitor_id", ["visitorId"]);
