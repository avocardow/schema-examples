// translation_keys: Source-language keys that translators localise into each target locale.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationKeysSchema = new mongoose.Schema(
  {
    namespace_id: { type: mongoose.Schema.Types.ObjectId, ref: "Namespace", required: true },
    key: { type: String, required: true },
    description: { type: String },
    max_length: { type: Number },
    is_plural: { type: Boolean, required: true, default: false },
    format: { type: String, required: true, default: "text" },
    is_hidden: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

translationKeysSchema.index({ namespace_id: 1, key: 1 }, { unique: true });
translationKeysSchema.index({ is_plural: 1 });

module.exports = mongoose.model("TranslationKey", translationKeysSchema);
