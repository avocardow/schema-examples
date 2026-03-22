// glossary_terms: Controlled terminology entries that guide translators on preferred or forbidden terms.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const glossaryTermsSchema = new mongoose.Schema(
  {
    term: { type: String, required: true },
    description: { type: String },
    part_of_speech: { type: String },
    domain: { type: String },
    source_locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    is_forbidden: { type: Boolean, required: true, default: false },
    is_case_sensitive: { type: Boolean, required: true, default: false },
    notes: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

glossaryTermsSchema.index({ source_locale_id: 1, term: 1 });
glossaryTermsSchema.index({ domain: 1 });

module.exports = mongoose.model("GlossaryTerm", glossaryTermsSchema);
