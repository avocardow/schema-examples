// playlist_followers: Users who follow specific playlists.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const playlistFollowersSchema = new mongoose.Schema(
  {
    playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

playlistFollowersSchema.index({ playlist_id: 1, user_id: 1 }, { unique: true });
playlistFollowersSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("PlaylistFollower", playlistFollowersSchema);
