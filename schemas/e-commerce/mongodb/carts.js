// carts: Shopping cart linking a user or guest session to addresses, currency, and discount info.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const cartsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    session_id: { type: String, default: null },
    currency: { type: String, required: true, default: "USD" },
    shipping_address_id: { type: mongoose.Schema.Types.ObjectId, ref: "Address", default: null },
    billing_address_id: { type: mongoose.Schema.Types.ObjectId, ref: "Address", default: null },
    discount_code: { type: String, default: null },
    note: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

cartsSchema.index({ user_id: 1 });
cartsSchema.index({ session_id: 1 });

module.exports = mongoose.model("Cart", cartsSchema);
