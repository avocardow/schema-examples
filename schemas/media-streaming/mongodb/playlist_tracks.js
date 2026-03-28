// playlist_tracks: Ordered tracks within a playlist, recording who added each track.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const playlistTracksSchema = new mongoose.Schema(
  {
    playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    position: { type: Number, required: true },
    added_at: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false }
);

playlistTracksSchema.index({ playlist_id: 1, position: 1 });
playlistTracksSchema.index({ track_id: 1 });

module.exports = mongoose.model("PlaylistTrack", playlistTracksSchema);
