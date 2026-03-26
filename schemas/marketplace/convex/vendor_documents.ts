// vendor_documents: Uploaded verification documents for vendor onboarding and compliance.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorDocuments = defineTable({
  vendorId: v.id("vendors"),
  type: v.union(
    v.literal("business_license"),
    v.literal("tax_certificate"),
    v.literal("identity_proof"),
    v.literal("bank_statement"),
    v.literal("other")
  ),
  fileUrl: v.string(),
  fileName: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("approved"),
    v.literal("rejected")
  ),
  rejectionReason: v.optional(v.string()),
  reviewedBy: v.optional(v.id("users")),
  reviewedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
})
  .index("by_vendor_id_type", ["vendorId", "type"])
  .index("by_status", ["status"]);
