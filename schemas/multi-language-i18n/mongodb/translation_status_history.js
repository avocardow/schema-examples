// translation_status_history: Append-only audit log of translation status transitions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationStatusHistorySchema = new mongoose.Schema(
  {
    translation_type: { type: String, required: true },
    translation_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    from_status: { type: String },
    to_status: { type: String, required: true },
    changed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

translationStatusHistorySchema.index({ translation_type: 1, translation_id: 1 });
translationStatusHistorySchema.index({ changed_by: 1 });

module.exports = mongoose.model("TranslationStatusHistory", translationStatusHistorySchema);
