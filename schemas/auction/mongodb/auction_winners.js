// auction_winners: Records winning bids with settlement tracking and buyer premium calculations.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const auction_winnerSchema = new mongoose.Schema(
  {
    auction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    winning_bid_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      required: true,
    },
    winner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hammer_price: { type: Number, required: true },
    buyer_premium: { type: Number, required: true, default: 0 },
    total_price: { type: Number, required: true },
    settlement_status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "disputed", "refunded"],
      required: true,
      default: "pending",
    },
    paid_at: { type: Date, default: null },
    shipped_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

auction_winnerSchema.index({ auction_id: 1 }, { unique: true });
auction_winnerSchema.index({ winning_bid_id: 1 }, { unique: true });
auction_winnerSchema.index({ winner_id: 1 });
auction_winnerSchema.index({ seller_id: 1 });
auction_winnerSchema.index({ settlement_status: 1 });

module.exports = mongoose.model("AuctionWinner", auction_winnerSchema);
