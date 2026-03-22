// glossary_term_translations: Target-locale translations of glossary terms.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const glossaryTermTranslationsSchema = new mongoose.Schema(
  {
    term_id: { type: mongoose.Schema.Types.ObjectId, ref: "GlossaryTerm", required: true },
    locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    translation: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["draft", "approved"],
      required: true,
      default: "draft",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

glossaryTermTranslationsSchema.index({ term_id: 1, locale_id: 1 }, { unique: true });
glossaryTermTranslationsSchema.index({ locale_id: 1 });

module.exports = mongoose.model("GlossaryTermTranslation", glossaryTermTranslationsSchema);
