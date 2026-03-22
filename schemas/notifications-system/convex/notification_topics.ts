// notification_topics: Named pub/sub groups for fan-out delivery.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_topics = defineTable({
  name: v.string(), // Display name (e.g., "Project Updates", "Marketing Newsletter").
  slug: v.string(), // Identifier used in code and API (e.g., "project_updates", "marketing").
  description: v.optional(v.string()), // Explain what subscribing to this topic means.

  updatedAt: v.number(),
})
  .index("by_slug", ["slug"]);
