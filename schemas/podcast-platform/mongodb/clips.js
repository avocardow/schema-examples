// clips: Short audio segments clipped from podcast episodes by users.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const clipsSchema = new mongoose.Schema(
  {
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    start_time_ms: { type: Number, required: true },
    duration_ms: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

clipsSchema.index({ episode_id: 1 });
clipsSchema.index({ created_by: 1 });

module.exports = mongoose.model("Clip", clipsSchema);
