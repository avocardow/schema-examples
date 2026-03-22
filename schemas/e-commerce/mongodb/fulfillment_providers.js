// fulfillment_providers: Shipping and delivery provider configurations for order fulfillment.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fulfillmentProvidersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: ["manual", "flat_rate", "carrier_calculated", "third_party"],
      required: true,
    },
    config: { type: mongoose.Schema.Types.Mixed, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

fulfillmentProvidersSchema.index({ is_active: 1 });

module.exports = mongoose.model("FulfillmentProvider", fulfillmentProvidersSchema);
