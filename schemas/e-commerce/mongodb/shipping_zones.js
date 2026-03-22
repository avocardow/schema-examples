// shipping_zones: Geographic zone definitions for grouping countries into shipping regions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const shippingZonesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    countries: { type: [String], required: true },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

shippingZonesSchema.index({ is_active: 1 });

module.exports = mongoose.model("ShippingZone", shippingZonesSchema);
