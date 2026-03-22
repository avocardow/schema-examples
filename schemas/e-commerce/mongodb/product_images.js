// product_images: Media assets linked to products or specific variants, with sortable display order.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const productImagesSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", default: null },
    url: { type: String, required: true },
    alt_text: { type: String, default: null },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
productImagesSchema.index({ product_id: 1, sort_order: 1 });
productImagesSchema.index({ variant_id: 1 });
module.exports = mongoose.model("ProductImage", productImagesSchema);
