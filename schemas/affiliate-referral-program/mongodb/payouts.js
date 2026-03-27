// payouts: Affiliate payout records tracking payment status and amounts.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    affiliate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
    },
    payout_number: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "canceled"],
      required: true,
      default: "pending",
    },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true, default: 0 },
    net_amount: { type: Number, required: true },
    payout_method: { type: String, default: null },
    provider_id: { type: String, default: null },
    note: { type: String, default: null },
    completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

payoutSchema.index({ affiliate_id: 1, status: 1 });
payoutSchema.index({ status: 1 });
payoutSchema.index({ created_at: 1 });

module.exports = mongoose.model("Payout", payoutSchema);
