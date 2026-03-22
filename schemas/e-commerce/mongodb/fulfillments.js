// fulfillments: Shipment tracking for orders including carrier, status, and delivery timestamps.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const fulfillmentsSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "FulfillmentProvider", default: null },
    shipping_method_id: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingMethod", default: null },
    status: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "delivered", "failed", "returned"],
      required: true,
      default: "pending",
    },
    tracking_number: { type: String, default: null },
    tracking_url: { type: String, default: null },
    carrier: { type: String, default: null },
    shipped_at: { type: Date, default: null },
    delivered_at: { type: Date, default: null },
    note: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

fulfillmentsSchema.index({ order_id: 1 });
fulfillmentsSchema.index({ provider_id: 1 });
fulfillmentsSchema.index({ status: 1 });
fulfillmentsSchema.index({ tracking_number: 1 });

module.exports = mongoose.model("Fulfillment", fulfillmentsSchema);
