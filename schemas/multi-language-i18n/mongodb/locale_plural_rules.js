// locale_plural_rules: Plural form rules and examples for specific locales.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const localePluralRulesSchema = new mongoose.Schema(
  {
    locale_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locale",
      required: true,
    },
    category: {
      type: String,
      enum: ["zero", "one", "two", "few", "many", "other"],
      required: true,
    },
    example: {
      type: String,
      default: null,
    },
    rule_formula: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

localePluralRulesSchema.index(
  { locale_id: 1, category: 1 },
  { unique: true }
);

module.exports = mongoose.model("LocalePluralRule", localePluralRulesSchema);
