// vendor_members: Team membership and role assignments for vendor accounts.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const vendorMembers = defineTable({
  vendorId: v.id("vendors"),
  userId: v.id("users"),
  role: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("editor"),
    v.literal("viewer")
  ),
  invitedBy: v.optional(v.id("users")),
  joinedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_vendor_id_user_id", ["vendorId", "userId"])
  .index("by_user_id", ["userId"]);
