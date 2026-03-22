// tax_rates: Tax rate definitions by country and region for order tax calculations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const taxRatesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, default: null },
    rate: { type: Number, required: true },
    category: { type: String, default: null },
    is_compound: { type: Boolean, required: true, default: false },
    is_active: { type: Boolean, required: true, default: true },
    priority: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

taxRatesSchema.index({ country: 1, region: 1 });
taxRatesSchema.index({ category: 1 });
taxRatesSchema.index({ is_active: 1 });

module.exports = mongoose.model("TaxRate", taxRatesSchema);
