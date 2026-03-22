// notification_preference_defaults: System-level and tenant-level default preferences.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_preference_defaults = defineTable({
  // Scope: "system" = platform-wide, "tenant" = within a specific organization/tenant.
  scope: v.union(v.literal("system"), v.literal("tenant")),

  scopeId: v.optional(v.string()), // The tenant/org ID. Null when scope = "system".

  categoryId: v.optional(v.id("notification_categories")),
  channelType: v.optional(
    v.union(
      v.literal("email"),
      v.literal("sms"),
      v.literal("push"),
      v.literal("in_app"),
      v.literal("chat"),
      v.literal("webhook"),
    ),
  ),

  enabled: v.boolean(),

  updatedAt: v.number(),
})
  .index("by_scope_scope_id", ["scope", "scopeId"])
  .index("by_scope", ["scope"])
  .index("by_scope_scope_id_category_channel", [
    "scope",
    "scopeId",
    "categoryId",
    "channelType",
  ]);
