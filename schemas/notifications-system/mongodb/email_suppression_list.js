// email_suppression_list: Email addresses that should not be sent to (bounces, complaints, unsubscribes).
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const emailSuppressionListSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // Lowercase, trimmed.

    reason: {
      type: String,
      enum: ["hard_bounce", "soft_bounce", "spam_complaint", "manual_unsubscribe", "invalid_address"],
      required: true,
    },

    source: {
      type: String,
      enum: ["provider_webhook", "user_action", "admin", "system"],
      required: true,
    },

    channel_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationChannel" }, // Which provider reported the suppression.

    details: { type: mongoose.Schema.Types.Mixed }, // Provider-specific details for debugging.

    suppressed_at: { type: Date, required: true, default: Date.now }, // When the suppression took effect.
    expires_at: { type: Date }, // Null = permanent suppression. Set for soft bounces that should be retried.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

emailSuppressionListSchema.index({ email: 1, reason: 1 }, { unique: true });
emailSuppressionListSchema.index({ email: 1 });
emailSuppressionListSchema.index({ reason: 1 });
emailSuppressionListSchema.index({ expires_at: 1 });

module.exports = mongoose.model("EmailSuppressionList", emailSuppressionListSchema);
