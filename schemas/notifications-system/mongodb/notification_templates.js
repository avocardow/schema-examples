// notification_templates: Reusable content definitions for a notification category.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationTemplatesSchema = new mongoose.Schema(
  {
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationCategory", required: true },
    name: { type: String, required: true }, // Internal name (e.g., "Comment Created — Default").
    slug: { type: String, unique: true, required: true }, // Identifier used in code (e.g., "comment_created_default").

    // Default content (channel-agnostic). Used when no channel-specific template_content exists.
    title_template: { type: String }, // e.g., "New comment on {{issue_title}}"
    body_template: { type: String }, // e.g., "{{actor_name}} commented: {{comment_body}}"
    action_url_template: { type: String }, // e.g., "{{app_url}}/issues/{{issue_id}}#comment-{{comment_id}}"

    is_active: { type: Boolean, required: true, default: true }, // Toggle a template without deleting it.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationTemplatesSchema.index({ category_id: 1 });

module.exports = mongoose.model("NotificationTemplate", notificationTemplatesSchema);
