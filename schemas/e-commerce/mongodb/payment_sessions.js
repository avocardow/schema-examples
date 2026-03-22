// payment_sessions: Tracks payment attempts and provider interactions for each shopping cart.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const paymentSessionsSchema = new mongoose.Schema(
  {
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    provider: { type: String, required: true },
    provider_id: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "authorized", "requires_action", "completed", "canceled", "error"],
      required: true,
      default: "pending",
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
    is_selected: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

paymentSessionsSchema.index({ cart_id: 1 });
paymentSessionsSchema.index({ provider: 1, provider_id: 1 });
paymentSessionsSchema.index({ status: 1 });

module.exports = mongoose.model("PaymentSession", paymentSessionsSchema);
