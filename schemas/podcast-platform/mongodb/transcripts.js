// transcripts: Episode transcripts in multiple formats with optional content storage.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const transcriptsSchema = new mongoose.Schema(
  {
    episode_id: { type: mongoose.Schema.Types.ObjectId, ref: "Episode", required: true },
    format: { type: String, enum: ["srt", "vtt", "json", "text"], required: true },
    content_url: { type: String, default: null },
    content: { type: String, default: null },
    language: { type: String, required: true, default: "en" },
    is_auto_generated: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

transcriptsSchema.index({ episode_id: 1, format: 1, language: 1 });

module.exports = mongoose.model("Transcript", transcriptsSchema);
