// schedules: named availability schedules owned by providers.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const schedules = defineTable({
  providerId: v.id("providers"),
  name: v.string(),
  timezone: v.string(),
  isDefault: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_provider_id_is_default", ["providerId", "isDefault"]);
