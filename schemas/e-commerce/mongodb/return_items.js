// return_items: Individual line items within a return authorization, tracking quantity and condition of each returned product.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const returnItemsSchema = new mongoose.Schema(
  {
    return_authorization_id: { type: mongoose.Schema.Types.ObjectId, ref: "ReturnAuthorization", required: true },
    order_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, default: null },
    condition: {
      type: String,
      enum: ["unopened", "like_new", "used", "damaged", "defective"],
      default: null,
    },
    received_quantity: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

returnItemsSchema.index({ return_authorization_id: 1, order_item_id: 1 }, { unique: true });

module.exports = mongoose.model("ReturnItem", returnItemsSchema);
