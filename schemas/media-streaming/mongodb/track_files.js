// track_files: Audio file variants per track, storing quality, codec, and size info.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const trackFilesSchema = new mongoose.Schema(
  {
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    quality: { type: String, enum: ["low", "normal", "high", "lossless"], required: true },
    codec: { type: String, required: true },
    bitrate_kbps: { type: Number, default: null },
    sample_rate_hz: { type: Number, default: null },
    file_size_bytes: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

trackFilesSchema.index({ track_id: 1, quality: 1 });
trackFilesSchema.index({ file_id: 1 });

module.exports = mongoose.model("TrackFile", trackFilesSchema);
