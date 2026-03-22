// translation_values: Localised text for each translation key, locale, and plural category.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationValuesSchema = new mongoose.Schema(
  {
    translation_key_id: { type: mongoose.Schema.Types.ObjectId, ref: "TranslationKey", required: true },
    locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    plural_category: { type: String },
    value: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "in_review", "approved", "published", "rejected"],
      required: true,
      default: "draft",
    },
    is_machine_translated: { type: Boolean, required: true, default: false },
    source_digest: { type: String },
    translator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

translationValuesSchema.index(
  { translation_key_id: 1, locale_id: 1, plural_category: 1 },
  { unique: true, sparse: true }
);
translationValuesSchema.index({ locale_id: 1, status: 1 });
translationValuesSchema.index({ status: 1 });
translationValuesSchema.index({ translator_id: 1 });

module.exports = mongoose.model("TranslationValue", translationValuesSchema);
