// shipping_methods: Delivery options with pricing and constraints, scoped to shipping zones and optionally to profiles.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const shippingMethodsSchema = new mongoose.Schema(
  {
    zone_id: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingZone", required: true },
    profile_id: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingProfile", default: null },
    name: { type: String, required: true },
    description: { type: String, default: null },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    min_delivery_days: { type: Number, default: null },
    max_delivery_days: { type: Number, default: null },
    min_order_amount: { type: Number, default: null },
    max_weight_grams: { type: Number, default: null },
    is_active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

shippingMethodsSchema.index({ zone_id: 1, is_active: 1, sort_order: 1 });
shippingMethodsSchema.index({ profile_id: 1 });

module.exports = mongoose.model("ShippingMethod", shippingMethodsSchema);
