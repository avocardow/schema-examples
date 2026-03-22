// translation_reviews: Append-only reviewer decisions (approve, reject, request changes) on translations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationReviewsSchema = new mongoose.Schema(
  {
    translation_type: { type: String, required: true },
    translation_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["approve", "reject", "request_changes"],
      required: true,
    },
    comment: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

translationReviewsSchema.index({ translation_type: 1, translation_id: 1 });
translationReviewsSchema.index({ reviewer_id: 1 });

module.exports = mongoose.model("TranslationReview", translationReviewsSchema);
