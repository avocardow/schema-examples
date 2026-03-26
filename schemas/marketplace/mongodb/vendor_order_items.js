// vendor_order_items: Line items within a vendor sub-order.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorOrderItemSchema = new mongoose.Schema(
  {
    vendor_order_id: { type: mongoose.Schema.Types.ObjectId, ref: "VendorOrder", required: true },
    order_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
    listing_variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ListingVariant", default: null },
    product_name: { type: String, required: true },
    variant_title: { type: String, required: true },
    sku: { type: String, default: null },
    unit_price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    commission_amount: { type: Number, required: true, default: 0 },
    vendor_earning: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

vendorOrderItemSchema.index({ vendor_order_id: 1 });
vendorOrderItemSchema.index({ order_item_id: 1 });

module.exports = mongoose.model("VendorOrderItem", vendorOrderItemSchema);
