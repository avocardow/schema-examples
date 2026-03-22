// product_collections: Curated product groupings for merchandising and storefront display.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const productCollectionsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    image_url: { type: String, default: null },
    sort_order: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    published_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
productCollectionsSchema.index({ is_active: 1, sort_order: 1 });
module.exports = mongoose.model("ProductCollection", productCollectionsSchema);
