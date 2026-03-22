// content_translations: Per-field translations for dynamic content entities.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contentTranslationsSchema = new mongoose.Schema(
  {
    resource_id: { type: mongoose.Schema.Types.ObjectId, ref: "TranslatableResource", required: true },
    entity_id: { type: String, required: true },
    locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    field_name: { type: String, required: true },
    value: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "in_review", "approved", "published", "rejected"],
      required: true,
      default: "draft",
    },
    source_digest: { type: String },
    translator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    version: { type: Number, required: true, default: 1 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

contentTranslationsSchema.index(
  { resource_id: 1, entity_id: 1, locale_id: 1, field_name: 1 },
  { unique: true }
);
contentTranslationsSchema.index({ locale_id: 1 });
contentTranslationsSchema.index({ status: 1 });

module.exports = mongoose.model("ContentTranslation", contentTranslationsSchema);
