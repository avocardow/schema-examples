// subscriptions: User subscriptions to podcast shows with playback and notification preferences.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const subscriptionsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    auto_download: { type: Boolean, required: true, default: false },
    download_wifi_only: { type: Boolean, required: true, default: true },
    notifications_enabled: { type: Boolean, required: true, default: true },
    custom_playback_speed: { type: Number, default: null },
    new_episode_sort: { type: String, enum: ["newest_first", "oldest_first"], required: true, default: "newest_first" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

subscriptionsSchema.index({ user_id: 1, show_id: 1 }, { unique: true });
subscriptionsSchema.index({ show_id: 1 });

module.exports = mongoose.model("Subscription", subscriptionsSchema);
