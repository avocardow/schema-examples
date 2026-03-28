// episode_queue: Ordered queue of podcast episodes queued for playback by a user.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const episode_queueSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    position: { type: Number, required: true },
    added_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

episode_queueSchema.index({ user_id: 1, episode_id: 1 }, { unique: true });
episode_queueSchema.index({ user_id: 1, position: 1 });

module.exports = mongoose.model("EpisodeQueue", episode_queueSchema);
