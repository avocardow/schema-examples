// response_templates: Pre-written response messages for moderator actions.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const response_templates = defineTable({
  name: v.string(), // Internal template name (e.g., "Spam Removal — First Offense").
  actionType: v.optional(
    v.union(
      v.literal("approve"),
      v.literal("remove"),
      v.literal("warn"),
      v.literal("mute"),
      v.literal("ban"),
      v.literal("restrict"),
      v.literal("escalate"),
      v.literal("label"),
    )
  ), // Which moderation action this template is for. Omitted = usable with any action type.
  content: v.string(), // Template text. May include placeholders like {{username}}, {{rule}}, {{appeal_url}}.
  violationCategoryId: v.optional(v.id("violation_categories")), // Suggested violation category for this template.
  scope: v.union(v.literal("global"), v.literal("community")), // global = available everywhere; community = specific to one community.
  scopeId: v.optional(v.string()), // Community ID. Omitted when scope = global.
  isActive: v.boolean(), // Whether this template is currently usable.
  createdBy: v.id("users"), // Who created this template.
  updatedAt: v.number(), // Unix epoch ms. No createdAt — Convex provides _creationTime.
})
  .index("by_scope", ["scope", "scopeId"])
  .index("by_action_type", ["actionType"])
  .index("by_violation_category", ["violationCategoryId"])
  .index("by_is_active", ["isActive"]);
