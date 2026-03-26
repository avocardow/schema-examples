// vendor_addresses: Physical addresses for vendor business, warehouse, and return locations.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorAddresses = defineTable({
  vendorId: v.id("vendors"),
  type: v.union(
    v.literal("business"),
    v.literal("warehouse"),
    v.literal("return")
  ),
  label: v.optional(v.string()),
  addressLine1: v.string(),
  addressLine2: v.optional(v.string()),
  city: v.string(),
  region: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.string(),
  phone: v.optional(v.string()),
  isDefault: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_vendor_id_type", ["vendorId", "type"]);
