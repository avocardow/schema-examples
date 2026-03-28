// tracks: Individual audio tracks with playback metadata and popularity counters.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const tracksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration_ms: { type: Number, required: true },
    explicit: { type: Boolean, required: true, default: false },
    isrc: { type: String, default: null },
    popularity: { type: Number, required: true, default: 0 },
    preview_url: { type: String, default: null },
    play_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tracksSchema.index({ popularity: 1 });
tracksSchema.index({ play_count: 1 });
tracksSchema.index({ isrc: 1 });
tracksSchema.index({ title: 1 });

module.exports = mongoose.model("Track", tracksSchema);
