// translation_comments: Threaded discussion comments attached to translations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationCommentsSchema = new mongoose.Schema(
  {
    translation_type: { type: String, required: true },
    translation_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "TranslationComment" },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    issue_type: { type: String },
    is_resolved: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

translationCommentsSchema.index({ translation_type: 1, translation_id: 1 });
translationCommentsSchema.index({ parent_id: 1 });
translationCommentsSchema.index({ author_id: 1 });

module.exports = mongoose.model("TranslationComment", translationCommentsSchema);
