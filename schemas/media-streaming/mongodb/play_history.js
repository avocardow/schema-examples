// play_history: Per-user track playback history with context and completion status.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const playHistorySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    duration_ms: { type: Number, required: true },
    completed: { type: Boolean, required: true, default: false },
    context_type: { type: String, enum: ["album", "playlist", "artist", "chart", "search", "queue", "unknown"], required: true, default: "unknown" },
    context_id: { type: String, default: null },
    played_at: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false }
);

playHistorySchema.index({ user_id: 1, played_at: 1 });
playHistorySchema.index({ track_id: 1, played_at: 1 });

module.exports = mongoose.model("PlayHistory", playHistorySchema);
