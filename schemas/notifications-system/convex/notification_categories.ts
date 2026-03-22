// notification_categories: Classification of notification types for organizing user preferences and routing to feeds.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_categories = defineTable({
  name: v.string(), // Display name (e.g., "Comments", "Billing", "Security Alerts").
  slug: v.string(), // Identifier used in code and API (e.g., "comments", "billing", "security").
  description: v.optional(v.string()), // Explain what triggers notifications in this category.
  color: v.optional(v.string()), // Hex color for UI display (e.g., "#3B82F6").
  icon: v.optional(v.string()), // Icon identifier or URL for UI display.

  // Critical/required notifications bypass user preferences entirely.
  // Security alerts, billing failures, legal notices, and account lockouts should be is_required=true.
  isRequired: v.boolean(),

  // Default feed: where notifications of this category appear.
  // Null = no default feed (appears in all feeds).
  defaultFeedId: v.optional(v.id("notification_feeds")),

  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_is_required", ["isRequired"]);
