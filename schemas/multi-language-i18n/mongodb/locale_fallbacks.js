// locale_fallbacks: Ordered fallback chains for missing translations per locale.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const localeFallbacksSchema = new mongoose.Schema(
  {
    locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    fallback_locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
    priority: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

localeFallbacksSchema.index({ locale_id: 1, fallback_locale_id: 1 }, { unique: true });
localeFallbacksSchema.index({ locale_id: 1, priority: 1 }, { unique: true });

module.exports = mongoose.model("LocaleFallback", localeFallbacksSchema);
