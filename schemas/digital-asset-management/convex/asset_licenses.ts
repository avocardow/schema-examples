// asset_licenses: Links specific license terms to individual assets.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const assetLicenses = defineTable({
  assetId: v.id("assets"),
  licenseId: v.id("licenses"),
  effectiveDate: v.string(),
  expiryDate: v.optional(v.string()),
  notes: v.optional(v.string()),
  assignedBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_asset_id", ["assetId"])
  .index("by_license_id", ["licenseId"])
  .index("by_expiry_date", ["expiryDate"]);
