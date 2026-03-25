// tenant_settings: Per-organization configuration key-value pairs.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tenant_settings = defineTable({
  organizationId: v.id("organizations"),
  key: v.string(),
  value: v.string(),
  updatedAt: v.number(),
})
  .index("by_organization_id_and_key", ["organizationId", "key"]);
