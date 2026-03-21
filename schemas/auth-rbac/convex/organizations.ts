// organizations: Tenant / workspace / company. Top-level grouping for multi-tenant apps.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizations = defineTable({
  name: v.string(), // Display name (e.g., "Acme Corporation").
  slug: v.string(), // URL-safe identifier (e.g., "acme-corp").
  logoUrl: v.optional(v.string()),

  externalId: v.optional(v.string()), // Link to external system (billing, CRM).
  stripeCustomerId: v.optional(v.string()), // Direct Stripe link.

  maxMembers: v.optional(v.number()), // Plan-based member limit. Null = unlimited.
  publicMetadata: v.optional(v.any()), // Client-readable, server-writable.
  privateMetadata: v.optional(v.any()), // Server-only (internal billing notes, feature flags).

  updatedAt: v.number(),
  deletedAt: v.optional(v.number()), // Soft delete.
})
  .index("by_slug", ["slug"])
  .index("by_external_id", ["externalId"])
  .index("by_stripe_customer_id", ["stripeCustomerId"]);
