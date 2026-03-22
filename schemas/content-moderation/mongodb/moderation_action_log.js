// moderation_action_log: Immutable audit trail of moderation events.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const moderationActionLogSchema = new mongoose.Schema(
  {
    actor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who performed the action. Restrict delete at application level.

    action_type: { type: String, required: true }, // What happened. Not an enum — new action types should not require schema migration.
    target_type: { type: String, required: true }, // What entity the action was on (e.g., "queue_item", "report", "user", "moderation_rule", "policy").
    target_id: { type: String, required: true },   // ID of the target entity.

    details: { type: mongoose.Schema.Types.Mixed, default: null }, // Event-specific context (e.g., action_taken: {"action_type": "ban", "reason": "..."}).
    ip_address: { type: String, default: null },                   // Client IP address for security audit.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
moderationActionLogSchema.index({ actor_id: 1 });
moderationActionLogSchema.index({ action_type: 1 });
moderationActionLogSchema.index({ target_type: 1, target_id: 1 });
moderationActionLogSchema.index({ created_at: 1 });

module.exports = mongoose.model("ModerationActionLog", moderationActionLogSchema);
