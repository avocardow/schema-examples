// blocked_ips: IP-level access blocking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const blocked_ips = defineTable({
  // Required fields
  ipAddress: v.string(), // IP address or CIDR range (e.g., "192.168.1.100", "10.0.0.0/8").
  severity: v.union(
    v.literal("sign_up_block"),
    v.literal("login_block"),
    v.literal("full_block")
  ), // sign_up_block = prevent new account creation. login_block = prevent login. full_block = block all access.

  // Foreign keys
  createdBy: v.id("users"), // Who blocked this IP. Restrict: don't delete users who created blocks.

  // Optional fields
  reason: v.optional(v.string()), // Why this IP was blocked.
  expiresAt: v.optional(v.number()), // Unix epoch ms. Null = permanent block.

  // Timestamps
  updatedAt: v.number(), // Unix epoch ms.
  // no createdAt — Convex provides _creationTime
})
  .index("by_severity", ["severity"])
  .index("by_expires_at", ["expiresAt"])
  .index("by_created_by", ["createdBy"])
  .index("by_ip_address", ["ipAddress"]);
