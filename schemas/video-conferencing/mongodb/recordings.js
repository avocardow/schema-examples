// recordings: Meeting recordings with processing status and file metadata.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recordingsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    type: { type: String, enum: ["composite", "audio_only", "video_only", "screen_share"], required: true, default: "composite" },
    status: { type: String, enum: ["recording", "processing", "ready", "failed", "deleted"], required: true, default: "recording" },
    duration_seconds: { type: Number, default: null },
    file_size: { type: Number, default: null },
    started_at: { type: Date, required: true, default: Date.now },
    ended_at: { type: Date, default: null },
    started_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

recordingsSchema.index({ meeting_id: 1 });
recordingsSchema.index({ status: 1 });
recordingsSchema.index({ started_by: 1 });

module.exports = mongoose.model("Recording", recordingsSchema);
