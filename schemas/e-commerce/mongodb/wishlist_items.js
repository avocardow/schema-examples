// wishlist_items: Individual product variants saved to a customer's wishlist.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const wishlistItemsSchema = new mongoose.Schema(
  {
    wishlist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
  },
  { timestamps: { createdAt: "added_at", updatedAt: false } }
);
wishlistItemsSchema.index({ wishlist_id: 1, variant_id: 1 }, { unique: true });
module.exports = mongoose.model("WishlistItem", wishlistItemsSchema);
