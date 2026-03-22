// device_tokens: Push notification device tokens and web push subscriptions.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const deviceTokensSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Platform: which type of device/browser this token is for.
    platform: {
      type: String,
      enum: ["ios", "android", "web", "macos", "windows"],
      required: true,
    },

    // The push token itself — opaque string from FCM, APNs, or the web push endpoint.
    token: { type: String, required: true },

    // Which push service provider issued/manages this token (e.g., "fcm", "apns", "web_push", "onesignal", "expo").
    provider: { type: String, required: true },

    // App identifier: which app this token belongs to (for multi-app setups).
    app_id: { type: String },

    // Web Push specific fields (RFC 8030 / VAPID). Null for native push tokens.
    p256dh_key: { type: String },   // ECDH P-256 public key from the browser.
    auth_key: { type: String },     // 16-byte authentication secret from the browser.
    endpoint_url: { type: String }, // Web push endpoint URL.

    // Device metadata: useful for debugging and analytics.
    device_name: { type: String },  // e.g., "iPhone 15 Pro", "Chrome on MacBook".
    device_model: { type: String }, // e.g., "iPhone15,3", "Pixel 8".
    os_version: { type: String },   // e.g., "17.2", "14".
    app_version: { type: String },  // e.g., "2.1.0".

    is_active: { type: Boolean, default: true, required: true },
    last_used_at: { type: Date },
    expires_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

deviceTokensSchema.index({ user_id: 1 });
deviceTokensSchema.index({ user_id: 1, platform: 1, is_active: 1 });
deviceTokensSchema.index({ token: 1, provider: 1 });
deviceTokensSchema.index({ is_active: 1, last_used_at: 1 });

module.exports = mongoose.model("DeviceToken", deviceTokensSchema);
