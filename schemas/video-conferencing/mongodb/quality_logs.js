// quality_logs: Periodic network and media quality samples per participant.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const qualityLogsSchema = new mongoose.Schema(
  {
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },
    participant_id: { type: mongoose.Schema.Types.ObjectId, ref: "MeetingParticipant", required: true },
    bitrate_kbps: { type: Number, default: null },
    packet_loss_pct: { type: Number, default: null },
    jitter_ms: { type: Number, default: null },
    round_trip_ms: { type: Number, default: null },
    video_width: { type: Number, default: null },
    video_height: { type: Number, default: null },
    framerate: { type: Number, default: null },
    quality_score: { type: Number, default: null },
    logged_at: { type: Date, required: true, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

qualityLogsSchema.index({ meeting_id: 1, logged_at: 1 });
qualityLogsSchema.index({ participant_id: 1, logged_at: 1 });

module.exports = mongoose.model("QualityLog", qualityLogsSchema);
