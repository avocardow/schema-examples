// track_credits: Artist credits and roles for each track (primary, featured, producer, etc.).
// See README.md for full design rationale.

const mongoose = require("mongoose");

const trackCreditsSchema = new mongoose.Schema(
  {
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    role: { type: String, enum: ["primary_artist", "featured_artist", "writer", "producer", "composer", "mixer", "engineer"], required: true },
  },
  { timestamps: false }
);

trackCreditsSchema.index({ track_id: 1, artist_id: 1, role: 1 }, { unique: true });
trackCreditsSchema.index({ artist_id: 1, role: 1 });

module.exports = mongoose.model("TrackCredit", trackCreditsSchema);
