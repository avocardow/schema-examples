// followed_artists: Artists followed by users for updates and recommendations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const followedArtistsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

followedArtistsSchema.index({ user_id: 1, artist_id: 1 }, { unique: true });
followedArtistsSchema.index({ artist_id: 1 });

module.exports = mongoose.model("FollowedArtist", followedArtistsSchema);
