// integration_definitions: Catalog of available third-party integrations and their auth requirements.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const integration_definitions = defineTable({
  key: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  iconUrl: v.optional(v.string()),
  authMethod: v.union(
    v.literal("oauth2"),
    v.literal("api_key"),
    v.literal("webhook"),
    v.literal("none"),
  ),
  configSchema: v.optional(v.any()),
  isEnabled: v.boolean(),
  sortOrder: v.number(),
  updatedAt: v.number(),
})
  .index("by_key", ["key"])
  .index("by_is_enabled", ["isEnabled"]);
