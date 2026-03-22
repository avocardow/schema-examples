// product_variants: Purchasable SKU-level variants of a product with dimensions and inventory attributes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const productVariantsSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    shipping_profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingProfile", default: null },

    sku: { type: String, unique: true, sparse: true, default: null },
    barcode: { type: String, default: null },

    title: { type: String, required: true },
    option_values: { type: mongoose.Schema.Types.Mixed, default: null },

    weight_grams: { type: Number, default: null },
    height_mm: { type: Number, default: null },
    width_mm: { type: Number, default: null },
    length_mm: { type: Number, default: null },

    is_active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

productVariantsSchema.index({ product_id: 1 });
productVariantsSchema.index({ barcode: 1 });
productVariantsSchema.index({ shipping_profile_id: 1 });

module.exports = mongoose.model("ProductVariant", productVariantsSchema);
