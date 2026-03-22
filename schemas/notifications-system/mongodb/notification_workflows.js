// notification_workflows: Orchestration definitions for multi-step notification delivery.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationWorkflowsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Display name (e.g., "Comment Notification", "Weekly Digest").
    slug: { type: String, unique: true, required: true }, // Identifier used in code and API (e.g., "comment_notification").
    description: { type: String },

    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationCategory" }, // A category can have multiple workflows.

    is_critical: { type: Boolean, required: true, default: false }, // Critical workflows bypass user preferences entirely.
    is_active: { type: Boolean, required: true, default: true }, // Toggle a workflow without deleting it.

    trigger_identifier: { type: String, unique: true, required: true }, // Must be unique. Used in API/SDK calls.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationWorkflowsSchema.index({ category_id: 1 });
notificationWorkflowsSchema.index({ is_active: 1 });

module.exports = mongoose.model("NotificationWorkflow", notificationWorkflowsSchema);
