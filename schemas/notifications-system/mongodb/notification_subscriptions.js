// notification_subscriptions: Links users to topics with per-channel granularity for fan-out delivery.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationSubscriptionsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationTopic", required: true },

    // Null = subscribed on all channels. Set to a specific channel to subscribe only that channel.
    channel_type: {
      type: String,
      enum: ["email", "sms", "push", "in_app", "chat", "webhook"],
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Compound unique: one subscription per user per topic per channel.
// sparse: true allows multiple docs where channel_type is null.
notificationSubscriptionsSchema.index(
  { user_id: 1, topic_id: 1, channel_type: 1 },
  { unique: true, sparse: true }
);

notificationSubscriptionsSchema.index({ topic_id: 1 }); // All subscribers to this topic (for fan-out).
notificationSubscriptionsSchema.index({ user_id: 1 }); // All topics this user is subscribed to.

module.exports = mongoose.model("NotificationSubscription", notificationSubscriptionsSchema);
