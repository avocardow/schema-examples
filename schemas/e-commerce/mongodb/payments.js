// payments: Individual payment transactions (authorizations, captures, sales) against orders.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const paymentsSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    payment_method_id: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", default: null },
    provider: { type: String, required: true },
    provider_id: { type: String, default: null },
    type: {
      type: String,
      enum: ["authorization", "capture", "sale"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "canceled"],
      required: true,
      default: "pending",
    },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    provider_fee: { type: Number, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    error_message: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

paymentsSchema.index({ order_id: 1 });
paymentsSchema.index({ provider: 1, provider_id: 1 });
paymentsSchema.index({ status: 1 });

module.exports = mongoose.model("Payment", paymentsSchema);
