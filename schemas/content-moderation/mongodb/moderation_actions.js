// moderation_actions: Enforcement actions taken by moderators or automated systems.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const moderationActionsSchema = new mongoose.Schema(
  {
    queue_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModerationQueueItem",
      default: null,
    }, // The queue item that prompted this action. Null = proactive action not from queue.
    moderator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // Who took this action. Null = automated action.
    action_type: {
      type: String,
      enum: [
        "approve",
        "remove",
        "warn",
        "mute",
        "ban",
        "restrict",
        "escalate",
        "label",
      ],
      required: true,
    },
    target_type: {
      type: String,
      enum: ["content", "user", "account"],
      required: true,
    },
    target_id: { type: String, required: true }, // String for external ID support.
    reason: { type: String, default: null },
    violation_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViolationCategory",
      default: null,
    },
    response_template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResponseTemplate",
      default: null,
    },
    is_automated: { type: Boolean, required: true, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
moderationActionsSchema.index({ queue_item_id: 1 });
moderationActionsSchema.index({ moderator_id: 1 });
moderationActionsSchema.index({ action_type: 1 });
moderationActionsSchema.index({ target_type: 1, target_id: 1 });
moderationActionsSchema.index({ violation_category_id: 1 });
moderationActionsSchema.index({ is_automated: 1 });
moderationActionsSchema.index({ created_at: 1 });

module.exports = mongoose.model("ModerationAction", moderationActionsSchema);
