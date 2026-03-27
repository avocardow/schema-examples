// payout_items: Individual commission amounts included in an affiliate payout.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const payoutItemSchema = new mongoose.Schema(
  {
    payout_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payout", required: true },
    commission_id: { type: mongoose.Schema.Types.ObjectId, ref: "Commission", required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

payoutItemSchema.index({ payout_id: 1, commission_id: 1 }, { unique: true });

module.exports = mongoose.model("PayoutItem", payoutItemSchema);
