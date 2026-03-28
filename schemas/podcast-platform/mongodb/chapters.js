// chapters: Timestamped chapter markers within podcast episodes.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const chaptersSchema = new mongoose.Schema(
  {
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    start_time_ms: { type: Number, required: true },
    end_time_ms: { type: Number, default: null },
    title: { type: String, required: true },
    url: { type: String, default: null },
    image_url: { type: String, default: null },
    is_hidden: { type: Boolean, required: true, default: false },
    position: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

chaptersSchema.index({ episode_id: 1, start_time_ms: 1 });

module.exports = mongoose.model("Chapter", chaptersSchema);
