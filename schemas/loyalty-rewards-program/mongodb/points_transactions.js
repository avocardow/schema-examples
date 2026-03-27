// points_transactions: Immutable ledger of every point movement (earn, redeem, expire, adjust).
// See README.md for full design rationale.
const mongoose = require("mongoose");

const pointsTransactionSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyMember",
      required: true,
    },
    type: {
      type: String,
      enum: ["earn", "redeem", "expire", "adjust", "bonus"],
      required: true,
    },
    points: { type: Number, required: true },
    balance_after: { type: Number, required: true },
    description: { type: String, default: null },
    source_reference_type: { type: String, default: null },
    source_reference_id: { type: String, default: null },
    earning_rule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EarningRule",
      default: null,
    },
    promotion_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      default: null,
    },
    redemption_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RewardRedemption",
      default: null,
    },
    expires_at: { type: Date, default: null },
    is_pending: { type: Boolean, required: true, default: false },
    confirmed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

pointsTransactionSchema.index({ member_id: 1, created_at: 1 });
pointsTransactionSchema.index({ type: 1 });
pointsTransactionSchema.index({ expires_at: 1 });
pointsTransactionSchema.index({ is_pending: 1 });
pointsTransactionSchema.index({ source_reference_type: 1, source_reference_id: 1 });

module.exports = mongoose.model("PointsTransaction", pointsTransactionSchema);
