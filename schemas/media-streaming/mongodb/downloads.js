// downloads: Offline download records per user with status and expiration tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const downloadsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    track_file_id: { type: mongoose.Schema.Types.ObjectId, ref: "TrackFile", required: true },
    status: { type: String, enum: ["pending", "downloading", "completed", "expired", "failed"], required: true, default: "pending" },
    expires_at: { type: Date, default: null },
    downloaded_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

downloadsSchema.index({ user_id: 1, track_file_id: 1 }, { unique: true });
downloadsSchema.index({ user_id: 1, status: 1 });
downloadsSchema.index({ expires_at: 1 });

module.exports = mongoose.model("Download", downloadsSchema);
