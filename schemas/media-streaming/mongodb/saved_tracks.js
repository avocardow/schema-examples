// saved_tracks: Tracks saved to a user's personal library.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const savedTracksSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

savedTracksSchema.index({ user_id: 1, track_id: 1 }, { unique: true });
savedTracksSchema.index({ user_id: 1, created_at: 1 });

module.exports = mongoose.model("SavedTrack", savedTracksSchema);
