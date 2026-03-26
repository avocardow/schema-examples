// vendor_orders: Sub-orders split by vendor from a marketplace order.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorOrderSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    vendor_order_number: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "canceled", "refunded"],
      required: true,
      default: "pending",
    },
    currency: { type: String, required: true },
    subtotal: { type: Number, required: true },
    shipping_total: { type: Number, required: true, default: 0 },
    tax_total: { type: Number, required: true, default: 0 },
    discount_total: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    commission_amount: { type: Number, required: true, default: 0 },
    vendor_earning: { type: Number, required: true, default: 0 },
    note: { type: String, default: null },
    shipped_at: { type: Date, default: null },
    delivered_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

vendorOrderSchema.index({ order_id: 1 });
vendorOrderSchema.index({ vendor_id: 1, status: 1 });
vendorOrderSchema.index({ status: 1 });
vendorOrderSchema.index({ created_at: 1 });

module.exports = mongoose.model("VendorOrder", vendorOrderSchema);
