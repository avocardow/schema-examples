// custom_domains: Custom domains mapped to an organization for white-label access.
// Tracks DNS verification status and SSL certificate lifecycle.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const custom_domains = defineTable({
  organizationId: v.id("organizations"),
  domain: v.string(), // Fully qualified domain, e.g. "app.acme.com".
  verificationMethod: v.union(v.literal("cname"), v.literal("txt")),
  verificationToken: v.string(),
  isVerified: v.boolean(),
  verifiedAt: v.optional(v.number()),
  sslStatus: v.union(
    v.literal("pending"),
    v.literal("active"),
    v.literal("failed"),
    v.literal("expired")
  ),
  sslExpiresAt: v.optional(v.number()),
  isPrimary: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_organization_id", ["organizationId"])
  .index("by_domain", ["domain"]);
