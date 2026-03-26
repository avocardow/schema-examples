// listing_variants: Pricing and stock for each variant within a listing.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const listingVariantSchema = new mongoose.Schema(
  {
    listing_id: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    sale_price: { type: Number, default: null },
    stock_quantity: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

listingVariantSchema.index({ listing_id: 1, variant_id: 1 }, { unique: true });
listingVariantSchema.index({ variant_id: 1, is_active: 1 });

module.exports = mongoose.model("ListingVariant", listingVariantSchema);
