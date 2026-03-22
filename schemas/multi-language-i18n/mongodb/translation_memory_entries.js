// translation_memory_entries: Reusable source/target text pairs for translation memory lookups.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationMemoryEntriesSchema = new mongoose.Schema(
  {
    source_locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    target_locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    source_text: { type: String, required: true },
    target_text: { type: String, required: true },
    source_hash: { type: String, required: true },
    domain: { type: String },
    quality_score: { type: Number },
    usage_count: { type: Number, required: true, default: 0 },
    source: { type: String, required: true, default: "human" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

translationMemoryEntriesSchema.index({ source_locale_id: 1, target_locale_id: 1, source_hash: 1 });
translationMemoryEntriesSchema.index({ domain: 1 });

module.exports = mongoose.model("TranslationMemoryEntry", translationMemoryEntriesSchema);
