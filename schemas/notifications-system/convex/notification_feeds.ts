// notification_feeds: Named UI surfaces where notifications can appear (e.g., bell icon, activity tab, announcements banner).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_feeds = defineTable({
  name: v.string(), // Display name (e.g., "General", "Activity", "Announcements").
  slug: v.string(), // URL-safe identifier (e.g., "general"). Used in API calls: GET /feeds/general.
  description: v.optional(v.string()), // Explain what this feed is for. Shown in admin UI.
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"]);
