// notification_channels: Configured delivery provider instances (e.g., "SendGrid for production email").
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationChannelsSchema = new mongoose.Schema(
  {
    channel_type: {
      type: String,
      enum: ["email", "sms", "push", "in_app", "chat", "webhook"],
      required: true,
    },

    provider: { type: String, required: true }, // e.g., 'sendgrid', 'twilio', 'fcm', 'slack', 'custom'.

    name: { type: String, required: true }, // Display name (e.g., "SendGrid Production").

    // ⚠️  Provider credentials MUST be encrypted at rest.
    credentials: { type: mongoose.Schema.Types.Mixed, required: true },

    is_active: { type: Boolean, required: true, default: true },
    is_primary: { type: Boolean, required: true, default: false }, // Only one channel per channel_type should be primary.
    priority: { type: Number, required: true, default: 0 }, // Lower = higher priority for failover ordering.

    config: { type: mongoose.Schema.Types.Mixed, default: {} }, // Provider-specific configuration.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationChannelsSchema.index({ channel_type: 1, is_active: 1 });
notificationChannelsSchema.index({ channel_type: 1, is_primary: 1 });
notificationChannelsSchema.index({ channel_type: 1, priority: 1 });

module.exports = mongoose.model("NotificationChannel", notificationChannelsSchema);
