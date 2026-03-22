// notification_workflows: Orchestration definitions for multi-step notification delivery.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_workflows = defineTable({
  name: v.string(), // Display name (e.g., "Comment Notification", "Weekly Digest").
  slug: v.string(), // Identifier used in code and API (e.g., "comment_notification").
  description: v.optional(v.string()),

  // Link to the category this workflow handles.
  // A category can have multiple workflows (e.g., immediate + digest versions).
  categoryId: v.optional(v.id("notification_categories")),

  // Critical workflows bypass user preferences entirely.
  // Use sparingly: security alerts, billing failures, legal notices.
  isCritical: v.boolean(),

  isActive: v.boolean(), // Toggle a workflow without deleting it.

  // The trigger identifier: what your app code calls to fire this workflow.
  // The system matches this value to route events to the correct workflow.
  triggerIdentifier: v.string(), // Must be unique. Used in API/SDK calls.

  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_trigger_identifier", ["triggerIdentifier"])
  .index("by_category_id", ["categoryId"])
  .index("by_is_active", ["isActive"]);
