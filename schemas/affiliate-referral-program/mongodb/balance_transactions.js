// balance_transactions: Tracks affiliate balance changes including commissions, payouts, reversals, and adjustments.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const balanceTransactionSchema = new mongoose.Schema(
  {
    affiliate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
    },
    type: {
      type: String,
      enum: ["commission", "payout", "reversal", "adjustment"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    running_balance: { type: Number, required: true },
    reference_type: { type: String, default: null },
    reference_id: { type: String, default: null },
    description: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

balanceTransactionSchema.index({ affiliate_id: 1, created_at: 1 });
balanceTransactionSchema.index({ type: 1 });
balanceTransactionSchema.index({ reference_type: 1, reference_id: 1 });

module.exports = mongoose.model("BalanceTransaction", balanceTransactionSchema);
