// watchlists: Tracks which auctions a user is watching with per-event notification preferences.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    auction_id: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    notify_outbid: { type: Boolean, required: true, default: true },
    notify_ending: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

watchlistSchema.index({ user_id: 1, auction_id: 1 }, { unique: true });
watchlistSchema.index({ auction_id: 1 });

module.exports = mongoose.model("Watchlist", watchlistSchema);
