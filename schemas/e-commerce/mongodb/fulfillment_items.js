// fulfillment_items: Links fulfillments to specific order items with the quantity fulfilled.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const fulfillmentItemsSchema = new mongoose.Schema(
  {
    fulfillment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Fulfillment", required: true },
    order_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
fulfillmentItemsSchema.index({ fulfillment_id: 1, order_item_id: 1 }, { unique: true });
module.exports = mongoose.model("FulfillmentItem", fulfillmentItemsSchema);
