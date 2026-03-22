// notification_preferences: Per-user opt-in/opt-out controls for notification categories and channels.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationPreferencesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Null = global preference (applies to all categories without a specific preference).
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationCategory" },

    // Null = all channels (applies to all channels without a specific preference).
    channel_type: {
      type: String,
      enum: ["email", "sms", "push", "in_app", "chat", "webhook"],
    },

    // true = opted in, false = opted out. Does NOT override is_required categories.
    enabled: { type: Boolean, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Compound unique: one preference per user/category/channel combination.
// sparse: true allows multiple documents with null category_id and/or channel_type.
notificationPreferencesSchema.index(
  { user_id: 1, category_id: 1, channel_type: 1 },
  { unique: true, sparse: true }
);

notificationPreferencesSchema.index({ user_id: 1 });
notificationPreferencesSchema.index({ user_id: 1, category_id: 1 });

module.exports = mongoose.model("NotificationPreference", notificationPreferencesSchema);
