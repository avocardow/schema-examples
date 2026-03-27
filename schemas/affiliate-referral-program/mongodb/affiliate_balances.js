// affiliate_balances: Tracks available, pending, and lifetime earnings per affiliate.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const affiliateBalanceSchema = new mongoose.Schema(
  {
    affiliate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
      unique: true,
    },
    currency: { type: String, required: true },
    available: { type: Number, required: true, default: 0 },
    pending: { type: Number, required: true, default: 0 },
    total_earned: { type: Number, required: true, default: 0 },
    total_paid_out: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);

module.exports = mongoose.model("AffiliateBalance", affiliateBalanceSchema);
