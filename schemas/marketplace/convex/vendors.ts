// vendors: Marketplace seller accounts with verification and commission tracking.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendors = defineTable({
  ownerId: v.id("users"),
  name: v.string(),
  slug: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  status: v.union(
    v.literal("pending"),
    v.literal("active"),
    v.literal("suspended"),
    v.literal("deactivated")
  ),
  verificationStatus: v.union(
    v.literal("unverified"),
    v.literal("pending_review"),
    v.literal("verified"),
    v.literal("rejected")
  ),
  commissionRate: v.optional(v.number()),
  metadata: v.optional(v.any()),
  approvedAt: v.optional(v.number()),
  suspendedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_owner_id", ["ownerId"])
  .index("by_slug", ["slug"])
  .index("by_status", ["status"])
  .index("by_verification_status", ["verificationStatus"]);
