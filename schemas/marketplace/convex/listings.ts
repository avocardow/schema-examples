// listings: Vendor product listings with approval workflow and condition tracking.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const listings = defineTable({
  vendorId: v.id("vendors"),
  productId: v.id("products"),
  status: v.union(
    v.literal("draft"),
    v.literal("pending_approval"),
    v.literal("active"),
    v.literal("paused"),
    v.literal("rejected"),
    v.literal("archived")
  ),
  condition: v.union(
    v.literal("new"),
    v.literal("refurbished"),
    v.literal("used_like_new"),
    v.literal("used_good"),
    v.literal("used_fair")
  ),
  handlingDays: v.number(),
  rejectionReason: v.optional(v.string()),
  approvedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_vendor_id_product_id", ["vendorId", "productId"])
  .index("by_product_id_status", ["productId", "status"])
  .index("by_status", ["status"]);
