// blocked_domains: Domain-level content blocking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const blocked_domains = defineTable({
  domain: v.string(), // The blocked domain (e.g., "spam-site.com"). Enforce uniqueness in mutations.

  // full = all content from this domain is blocked.
  // media_only = text content allowed, media rejected.
  // report_reject = reports from this domain's users are ignored.
  blockType: v.union(
    v.literal("full"),
    v.literal("media_only"),
    v.literal("report_reject")
  ),

  reason: v.optional(v.string()), // Why this domain was blocked.
  publicComment: v.optional(v.string()), // Comment visible to users about why the domain is blocked.
  privateComment: v.optional(v.string()), // Internal moderator note. Not visible to users.

  createdBy: v.id("users"), // Who blocked this domain. Restrict: don't delete users who own blocks.

  updatedAt: v.number(),
})
  .index("by_domain", ["domain"])
  .index("by_block_type", ["blockType"])
  .index("by_created_by", ["createdBy"]);
