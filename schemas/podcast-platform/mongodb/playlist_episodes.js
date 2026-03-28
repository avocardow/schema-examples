// playlist_episodes: Associates episodes with playlists at an ordered position.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const playlist_episodesSchema = new mongoose.Schema(
  {
    playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    position: { type: Number, required: true },
    added_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

playlist_episodesSchema.index({ playlist_id: 1, position: 1 });
playlist_episodesSchema.index({ episode_id: 1 });

module.exports = mongoose.model("PlaylistEpisode", playlist_episodesSchema);
