// bids: Individual bid placed on an auction with optional proxy bidding.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    auction_id: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    max_amount: { type: Number, default: null },
    status: {
      type: String,
      enum: ["active", "outbid", "winning", "won", "cancelled"],
      required: true,
      default: "active",
    },
    is_proxy: { type: Boolean, required: true, default: false },
    ip_address: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

bidSchema.index({ auction_id: 1, amount: 1 }, { unique: true });
bidSchema.index({ bidder_id: 1 });
bidSchema.index({ status: 1 });

module.exports = mongoose.model("Bid", bidSchema);
