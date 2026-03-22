// notification_preference_defaults: System-level and tenant-level default preferences for the three-tier hierarchy.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationPreferenceDefaultsSchema = new mongoose.Schema(
  {
    // "system" = all users platform-wide. "tenant" = all users within a specific org/tenant.
    scope: { type: String, enum: ["system", "tenant"], required: true },

    // The tenant/org ID. Null when scope = "system".
    // String (not ObjectId) to keep this domain portable across org/workspace/team models.
    scope_id: { type: String },

    // Null = global default (applies to all categories without a specific default).
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationCategory" },

    // Null = all channels (applies to all channels without a specific default).
    channel_type: {
      type: String,
      enum: ["email", "sms", "push", "in_app", "chat", "webhook"],
    },

    enabled: { type: Boolean, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Compound unique: one default per scope/scope_id/category/channel combination.
// sparse: true allows multiple documents with null category_id and/or channel_type.
notificationPreferenceDefaultsSchema.index(
  { scope: 1, scope_id: 1, category_id: 1, channel_type: 1 },
  { unique: true, sparse: true }
);

notificationPreferenceDefaultsSchema.index({ scope: 1, scope_id: 1 });
notificationPreferenceDefaultsSchema.index({ scope: 1 });

module.exports = mongoose.model("NotificationPreferenceDefault", notificationPreferenceDefaultsSchema);
