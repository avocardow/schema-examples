// listen_history: Records each play session for a user and episode, tracking position and playback source.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const listen_historySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    started_at: { type: Date, required: true },
    ended_at: { type: Date, default: null },
    position_start_ms: { type: Number, required: true },
    position_end_ms: { type: Number, default: null },
    duration_listened_ms: { type: Number, required: true, default: 0 },
    source: {
      type: String,
      enum: ["app", "web", "car", "smart_speaker", "watch", "unknown"],
      required: true,
      default: "unknown",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

listen_historySchema.index({ user_id: 1, started_at: 1 });
listen_historySchema.index({ episode_id: 1, started_at: 1 });

module.exports = mongoose.model("ListenHistory", listen_historySchema);
