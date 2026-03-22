// translation_key_tags: Free-form tags applied to translation keys for filtering and grouping.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationKeyTagsSchema = new mongoose.Schema(
  {
    translation_key_id: { type: mongoose.Schema.Types.ObjectId, ref: "TranslationKey", required: true },
    tag: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

translationKeyTagsSchema.index({ translation_key_id: 1, tag: 1 }, { unique: true });
translationKeyTagsSchema.index({ tag: 1 });

module.exports = mongoose.model("TranslationKeyTag", translationKeyTagsSchema);
