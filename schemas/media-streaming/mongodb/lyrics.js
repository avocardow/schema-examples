// lyrics: Track lyrics in plain text and time-synced formats with language metadata.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const lyricsSchema = new mongoose.Schema(
  {
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", unique: true, required: true },
    plain_text: { type: String, default: null },
    synced_text: { type: mongoose.Schema.Types.Mixed, default: null },
    language: { type: String, default: null },
    source: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

lyricsSchema.index({ language: 1 });

module.exports = mongoose.model("Lyric", lyricsSchema);
