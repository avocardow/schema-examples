// auctions: Auction listings with type, pricing, timing, and anti-sniping controls.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auction_type: {
      type: String,
      enum: ["english", "dutch", "sealed_bid", "buy_now_only"],
      required: true,
      default: "english",
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "active", "closing", "closed", "cancelled"],
      required: true,
      default: "draft",
    },
    title: { type: String, required: true },
    description: { type: String, default: null },
    starting_price: { type: Number, required: true },
    reserve_price: { type: Number, default: null },
    buy_now_price: { type: Number, default: null },
    current_price: { type: Number, required: true, default: 0 },
    bid_count: { type: Number, required: true, default: 0 },
    highest_bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    buyer_premium_pct: { type: Number, default: null },
    start_time: { type: Date, default: null },
    end_time: { type: Date, default: null },
    effective_end_time: { type: Date, default: null },
    extension_seconds: { type: Number, required: true, default: 300 },
    extension_window_seconds: { type: Number, required: true, default: 300 },
    currency: { type: String, required: true, default: "USD" },
    closed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

auctionSchema.index({ item_id: 1 });
auctionSchema.index({ seller_id: 1 });
auctionSchema.index({ status: 1 });
auctionSchema.index({ auction_type: 1 });
auctionSchema.index({ effective_end_time: 1 });

module.exports = mongoose.model("Auction", auctionSchema);
