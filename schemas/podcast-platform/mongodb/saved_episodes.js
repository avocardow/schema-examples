// saved_episodes: Records episodes bookmarked or saved by a user for later listening.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const saved_episodesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

saved_episodesSchema.index({ user_id: 1, episode_id: 1 }, { unique: true });
saved_episodesSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("SavedEpisode", saved_episodesSchema);
