// custom_fields: configurable intake form fields attached to services.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customFields = defineTable({
  serviceId: v.id("services"),
  label: v.string(),
  fieldType: v.union(
    v.literal("text"),
    v.literal("textarea"),
    v.literal("select"),
    v.literal("multi_select"),
    v.literal("checkbox"),
    v.literal("number"),
    v.literal("date"),
    v.literal("phone"),
    v.literal("email")
  ),
  placeholder: v.optional(v.string()),
  isRequired: v.boolean(),
  options: v.optional(v.any()),
  position: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_service_id_position", ["serviceId", "position"]);
