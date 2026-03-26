// vendor_profiles: Public-facing vendor storefront details and policies.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorProfiles = defineTable({
  vendorId: v.id("vendors"),
  displayName: v.string(),
  tagline: v.optional(v.string()),
  description: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
  bannerUrl: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  socialLinks: v.optional(v.any()),
  returnPolicy: v.optional(v.string()),
  shippingPolicy: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_vendor_id", ["vendorId"]);
