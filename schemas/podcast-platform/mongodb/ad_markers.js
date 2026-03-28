// ad_markers: Pre-roll, mid-roll, and post-roll ad insertion points in episodes.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const adMarkersSchema = new mongoose.Schema(
  {
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    marker_type: { type: String, enum: ["preroll", "midroll", "postroll"], required: true },
    position_ms: { type: Number, default: null },
    duration_ms: { type: Number, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

adMarkersSchema.index({ episode_id: 1, marker_type: 1 });

module.exports = mongoose.model("AdMarker", adMarkersSchema);
