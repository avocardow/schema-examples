// currencies: Supported currency definitions with exchange rates and display formatting.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const currenciesSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    decimal_places: { type: Number, required: true, default: 2 },
    exchange_rate: { type: Number, required: true, default: 1.0 },
    is_base: { type: Boolean, required: true, default: false },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

currenciesSchema.index({ is_active: 1 });

module.exports = mongoose.model("Currency", currenciesSchema);
