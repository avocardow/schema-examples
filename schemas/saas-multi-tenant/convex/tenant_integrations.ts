// tenant_integrations: Third-party integrations connected per organization.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tenant_integrations = defineTable({
  organizationId: v.id("organizations"),
  integrationId: v.id("integration_definitions"),
  status: v.union(
    v.literal("active"),
    v.literal("inactive"),
    v.literal("error")
  ),
  encryptedCredentials: v.optional(v.any()),
  config: v.optional(v.any()),
  connectedBy: v.id("users"),
  lastSyncedAt: v.optional(v.number()),
  errorMessage: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_organization_id_and_integration_id", ["organizationId", "integrationId"])
  .index("by_integration_id", ["integrationId"])
  .index("by_status", ["status"]);
