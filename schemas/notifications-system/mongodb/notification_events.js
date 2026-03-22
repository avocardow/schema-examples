// notification_events: Immutable event record — the trigger that causes notifications.
// One row per occurrence. Per-recipient state lives in the notifications table.
// Uses polymorphic actor/target (not FKs) so events survive entity deletion.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationEventsSchema = new mongoose.Schema(
  {
    // What kind of event this is (e.g., "comments", "billing", "security").
    // Restrict delete: don't orphan events by deleting their category.
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationCategory", required: true },

    // Polymorphic actor: who/what triggered this event.
    // Follows the Activity Streams 2.0 pattern (actor/verb/object/target).
    actor_type: { type: String }, // e.g., "user", "system", "api_key", "service".
    actor_id: { type: String },   // Not a FK — actors can be any entity type.

    // Polymorphic target: what was acted upon.
    target_type: { type: String }, // e.g., "comment", "invoice", "pull_request".
    target_id: { type: String },   // Not a FK — targets can be any entity type.

    // Lightweight grouping for related events (e.g., "issue:456", "pr:789").
    thread_key: { type: String },

    // Link to the workflow that triggered this event, if any.
    workflow_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationWorkflow" },

    // Event payload — all the data needed to render notification templates.
    data: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Idempotency: prevent duplicate events from the same trigger.
    // Null = no dedup (every trigger creates a new event).
    idempotency_key: { type: String, unique: true, sparse: true },

    // Expiration: for time-sensitive events. Null = never expires.
    expires_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

notificationEventsSchema.index({ category_id: 1 });
notificationEventsSchema.index({ actor_type: 1, actor_id: 1 });
notificationEventsSchema.index({ target_type: 1, target_id: 1 });
notificationEventsSchema.index({ thread_key: 1 });
notificationEventsSchema.index({ created_at: 1 });

module.exports = mongoose.model("NotificationEvent", notificationEventsSchema);
