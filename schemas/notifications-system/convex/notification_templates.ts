// notification_templates: Reusable content definitions for a notification category, rendered with event data at delivery time.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notification_templates = defineTable({
  categoryId: v.id("notification_categories"),
  name: v.string(), // Internal name (e.g., "Comment Created — Default").
  slug: v.string(), // Identifier used in code (e.g., "comment_created_default").

  // Default content (channel-agnostic). Used when no channel-specific template_content exists.
  titleTemplate: v.optional(v.string()), // e.g., "New comment on {{issue_title}}"
  bodyTemplate: v.optional(v.string()), // e.g., "{{actor_name}} commented: {{comment_body}}"
  actionUrlTemplate: v.optional(v.string()), // e.g., "{{app_url}}/issues/{{issue_id}}#comment-{{comment_id}}"

  isActive: v.boolean(), // Toggle a template without deleting it. Inactive templates are skipped during delivery.
  updatedAt: v.number(),
})
  .index("by_category_id", ["categoryId"])
  .index("by_slug", ["slug"]);
