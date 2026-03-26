// item_images: Photos and media attachments associated with auction items.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const itemImageSchema = new mongoose.Schema(
  {
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    url: { type: String, required: true },
    alt_text: { type: String, default: null },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

itemImageSchema.index({ item_id: 1 });

module.exports = mongoose.model("ItemImage", itemImageSchema);
