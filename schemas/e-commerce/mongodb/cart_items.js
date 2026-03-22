// cart_items: Individual line items within a shopping cart, linking a cart to a specific product variant with quantity.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const cartItemsSchema = new mongoose.Schema(
  {
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { timestamps: { createdAt: "added_at", updatedAt: "updated_at" } }
);
cartItemsSchema.index({ cart_id: 1, variant_id: 1 }, { unique: true });
module.exports = mongoose.model("CartItem", cartItemsSchema);
