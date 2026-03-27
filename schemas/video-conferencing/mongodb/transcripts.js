// transcripts: Meeting transcription sessions tracking language, status, and progress.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const transcriptsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    language: { type: String, required: true, default: "en" },
    status: { type: String, enum: ["processing", "ready", "failed"], required: true, default: "processing" },
    started_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    segment_count: { type: Number, required: true, default: 0 },
    started_at: { type: Date, required: true, default: Date.now },
    completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

transcriptsSchema.index({ meeting_id: 1 });
transcriptsSchema.index({ status: 1 });

module.exports = mongoose.model("Transcript", transcriptsSchema);
