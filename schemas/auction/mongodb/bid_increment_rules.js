// bid_increment_rules: Price-range-based increment tiers that control minimum bid step sizes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bidIncrementRulesSchema = new mongoose.Schema(
  {
    auction_id: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", default: null },
    min_price: { type: Number, required: true },
    max_price: { type: Number, default: null },
    increment: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

bidIncrementRulesSchema.index({ auction_id: 1 });
bidIncrementRulesSchema.index({ min_price: 1 });

module.exports = mongoose.model("BidIncrementRule", bidIncrementRulesSchema);
