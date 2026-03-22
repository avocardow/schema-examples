// refunds: Tracks refund requests and outcomes against payments and orders.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const refundsSchema = new mongoose.Schema(
  {
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    provider_id: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    reason: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      required: true,
      default: "pending",
    },
    note: { type: String, default: null },
    refunded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

refundsSchema.index({ payment_id: 1 });
refundsSchema.index({ order_id: 1 });
refundsSchema.index({ status: 1 });

module.exports = mongoose.model("Refund", refundsSchema);
