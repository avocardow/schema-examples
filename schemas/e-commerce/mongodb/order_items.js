// order_items: Snapshot of each product purchased within an order, capturing price and quantity at time of sale.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const orderItemsSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", default: null },
    product_name: { type: String, required: true },
    variant_title: { type: String, required: true },
    sku: { type: String, default: null },
    image_url: { type: String, default: null },
    unit_price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discount_total: { type: Number, required: true, default: 0 },
    tax_total: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    fulfilled_quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
orderItemsSchema.index({ order_id: 1 });
orderItemsSchema.index({ variant_id: 1 });
module.exports = mongoose.model("OrderItem", orderItemsSchema);
