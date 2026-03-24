// custom_fields: user-defined field definitions for extending CRM entities.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customFields = defineTable({
  entityType: v.union(
    v.literal("contact"),
    v.literal("company"),
    v.literal("deal"),
    v.literal("lead")
  ),
  name: v.string(),
  fieldType: v.union(
    v.literal("text"),
    v.literal("number"),
    v.literal("date"),
    v.literal("select"),
    v.literal("multi_select"),
    v.literal("checkbox"),
    v.literal("url")
  ),
  description: v.optional(v.string()),
  isRequired: v.boolean(),
  position: v.number(),
  updatedAt: v.number(),
})
  .index("by_entity_type_and_position", ["entityType", "position"]);
