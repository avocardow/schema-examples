// discount_usages: Tracks each time a discount is applied to an order, enforcing one use per order.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const discountUsagesSchema = new mongoose.Schema(
  {
    discount_id: { type: mongoose.Schema.Types.ObjectId, ref: "Discount", required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
discountUsagesSchema.index({ discount_id: 1, user_id: 1 });
discountUsagesSchema.index({ discount_id: 1, order_id: 1 }, { unique: true });
module.exports = mongoose.model("DiscountUsage", discountUsagesSchema);
