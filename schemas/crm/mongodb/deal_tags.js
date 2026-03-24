// deal_tags: Join table linking deals to tags.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const dealTagsSchema = new mongoose.Schema(
  {
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", required: true },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

dealTagsSchema.index({ deal_id: 1, tag_id: 1 }, { unique: true });
dealTagsSchema.index({ tag_id: 1 });

module.exports = mongoose.model("DealTag", dealTagsSchema);
