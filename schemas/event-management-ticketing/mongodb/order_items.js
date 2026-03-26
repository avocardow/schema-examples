// order_items: Individual line items within a ticket order.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const orderItemsSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    ticket_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketType", default: null },
    ticket_type_name: { type: String, required: true },
    unit_price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

orderItemsSchema.index({ order_id: 1 });
orderItemsSchema.index({ ticket_type_id: 1 });

module.exports = mongoose.model("OrderItem", orderItemsSchema);
