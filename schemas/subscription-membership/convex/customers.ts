// customers: billing customer entity.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customers = defineTable({
  userId: v.optional(v.id("users")),
  organizationId: v.optional(v.id("organizations")),
  name: v.string(),
  email: v.string(),
  currency: v.optional(v.string()),
  taxId: v.optional(v.string()),
  metadata: v.optional(v.any()),
  providerType: v.optional(v.string()),
  providerId: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_organization_id", ["organizationId"])
  .index("by_provider", ["providerType", "providerId"]);
