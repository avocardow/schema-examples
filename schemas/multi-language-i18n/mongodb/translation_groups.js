// translation_groups: Groups all locale variants of a single translatable entity together.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translationGroupsSchema = new mongoose.Schema(
  {
    resource_id: { type: mongoose.Schema.Types.ObjectId, ref: "TranslatableResource", required: true },
    entity_id: { type: String, required: true },
    source_locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

translationGroupsSchema.index({ resource_id: 1, entity_id: 1 }, { unique: true });
translationGroupsSchema.index({ source_locale_id: 1 });

module.exports = mongoose.model("TranslationGroup", translationGroupsSchema);
