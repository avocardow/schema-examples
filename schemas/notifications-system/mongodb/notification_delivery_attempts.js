// notification_delivery_attempts: Per-notification, per-channel delivery attempt log with full audit trail and retry tracking.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationDeliveryAttemptsSchema = new mongoose.Schema(
  {
    notification_id: { type: mongoose.Schema.Types.ObjectId, ref: "Notification", required: true },
    channel_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationChannel", required: true },

    // Delivery lifecycle. Mutually exclusive, progresses forward.
    status: {
      type: String,
      enum: ["pending", "queued", "sent", "delivered", "bounced", "failed"],
      required: true,
      default: "pending",
    },

    provider_message_id: { type: String }, // Provider's message ID for matching incoming webhooks.
    provider_response: { type: mongoose.Schema.Types.Mixed }, // Raw provider response for debugging.

    error_code: { type: String },     // Provider-specific error code.
    error_message: { type: String },  // Human-readable error description.

    // Retry tracking.
    attempt_number: { type: Number, required: true, default: 1 },
    next_retry_at: { type: Date },    // Null = no retry planned.

    sent_at: { type: Date },          // When the provider accepted the request.
    delivered_at: { type: Date },     // When delivery was confirmed via provider webhook.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationDeliveryAttemptsSchema.index({ notification_id: 1 });
notificationDeliveryAttemptsSchema.index({ channel_id: 1, status: 1 });
notificationDeliveryAttemptsSchema.index({ provider_message_id: 1 });
notificationDeliveryAttemptsSchema.index({ status: 1, next_retry_at: 1 });
notificationDeliveryAttemptsSchema.index({ created_at: 1 });

module.exports = mongoose.model("NotificationDeliveryAttempt", notificationDeliveryAttemptsSchema);
