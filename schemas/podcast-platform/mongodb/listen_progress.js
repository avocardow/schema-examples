// listen_progress: Tracks per-user playback position and completion state for each episode.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const listen_progressSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    position_ms: { type: Number, required: true, default: 0 },
    duration_ms: { type: Number, required: true, default: 0 },
    completed: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);

listen_progressSchema.index({ user_id: 1, episode_id: 1 }, { unique: true });
listen_progressSchema.index({ user_id: 1, completed: 1, updated_at: 1 });

module.exports = mongoose.model("ListenProgress", listen_progressSchema);
