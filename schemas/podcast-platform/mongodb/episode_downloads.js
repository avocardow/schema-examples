// episode_downloads: Tracks offline download requests and their status for podcast episodes per user device.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const episode_downloadsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    status: {
      type: String,
      enum: ["queued", "downloading", "completed", "failed", "expired"],
      required: true,
      default: "queued",
    },
    device_id: { type: String, default: null },
    file_size_bytes: { type: Number, default: null },
    downloaded_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

episode_downloadsSchema.index(
  { user_id: 1, episode_id: 1, device_id: 1 },
  { unique: true, sparse: true }
);
episode_downloadsSchema.index({ user_id: 1, status: 1 });
episode_downloadsSchema.index({ expires_at: 1 });

module.exports = mongoose.model("EpisodeDownload", episode_downloadsSchema);
