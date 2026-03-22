// product_collection_items: Join table linking products to curated collections with display ordering.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const productCollectionItemsSchema = new mongoose.Schema(
  {
    collection_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCollection", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "added_at", updatedAt: false } }
);
productCollectionItemsSchema.index({ collection_id: 1, product_id: 1 }, { unique: true });
productCollectionItemsSchema.index({ product_id: 1 });
module.exports = mongoose.model("ProductCollectionItem", productCollectionItemsSchema);
