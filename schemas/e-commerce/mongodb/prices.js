// prices: Currency-specific pricing tiers for product variants, with optional date ranges and quantity breaks.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pricesSchema = new mongoose.Schema(
  {
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    compare_at_amount: { type: Number, default: null },
    min_quantity: { type: Number, default: null },
    starts_at: { type: Date, default: null },
    ends_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

pricesSchema.index({ variant_id: 1, currency: 1 });
pricesSchema.index({ starts_at: 1, ends_at: 1 });

module.exports = mongoose.model("Price", pricesSchema);
