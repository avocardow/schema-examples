// album_tracks: Junction table linking tracks to albums with disc and position ordering.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const albumTracksSchema = new mongoose.Schema(
  {
    album_id: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    disc_number: { type: Number, required: true, default: 1 },
    position: { type: Number, required: true },
  },
  { timestamps: false }
);

albumTracksSchema.index({ album_id: 1, disc_number: 1, position: 1 }, { unique: true });
albumTracksSchema.index({ track_id: 1 });

module.exports = mongoose.model("AlbumTrack", albumTracksSchema);
