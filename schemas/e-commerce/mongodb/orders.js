// orders: Customer orders tracking status, totals, payment, fulfillment, and shipping/billing addresses.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    order_number: { type: String, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "canceled", "refunded"],
      required: true,
      default: "pending",
    },
    currency: { type: String, required: true },
    subtotal: { type: Number, required: true },
    discount_total: { type: Number, required: true, default: 0 },
    tax_total: { type: Number, required: true, default: 0 },
    shipping_total: { type: Number, required: true, default: 0 },
    grand_total: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid", "partially_refunded", "refunded"],
      required: true,
      default: "unpaid",
    },
    fulfillment_status: {
      type: String,
      enum: ["unfulfilled", "partially_fulfilled", "fulfilled"],
      required: true,
      default: "unfulfilled",
    },
    shipping_name: { type: String, default: null },
    shipping_address_line1: { type: String, default: null },
    shipping_address_line2: { type: String, default: null },
    shipping_city: { type: String, default: null },
    shipping_region: { type: String, default: null },
    shipping_postal_code: { type: String, default: null },
    shipping_country: { type: String, default: null },
    shipping_phone: { type: String, default: null },
    billing_name: { type: String, default: null },
    billing_address_line1: { type: String, default: null },
    billing_address_line2: { type: String, default: null },
    billing_city: { type: String, default: null },
    billing_region: { type: String, default: null },
    billing_postal_code: { type: String, default: null },
    billing_country: { type: String, default: null },
    discount_code: { type: String, default: null },
    note: { type: String, default: null },
    canceled_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

ordersSchema.index({ user_id: 1 });
ordersSchema.index({ status: 1 });
ordersSchema.index({ payment_status: 1 });
ordersSchema.index({ fulfillment_status: 1 });
ordersSchema.index({ created_at: 1 });

module.exports = mongoose.model("Order", ordersSchema);
