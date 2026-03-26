// feedback: Buyer and seller ratings exchanged after an auction concludes.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    auction_winner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuctionWinner",
      required: true,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    direction: {
      type: String,
      enum: ["buyer_to_seller", "seller_to_buyer"],
      required: true,
    },
    rating: { type: Number, required: true },
    comment: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

feedbackSchema.index({ auction_winner_id: 1, direction: 1 }, { unique: true });
feedbackSchema.index({ recipient_id: 1 });
feedbackSchema.index({ author_id: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
