// payout_items: Individual vendor order amounts included in a payout.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const payoutItemSchema = new mongoose.Schema(
  {
    payout_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payout", required: true },
    vendor_order_id: { type: mongoose.Schema.Types.ObjectId, ref: "VendorOrder", required: true },
    amount: { type: Number, required: true },
    commission: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

payoutItemSchema.index({ payout_id: 1, vendor_order_id: 1 }, { unique: true });

module.exports = mongoose.model("PayoutItem", payoutItemSchema);
