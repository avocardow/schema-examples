// orders: Ticket purchase orders tied to an event and buyer.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    promo_code_id: { type: mongoose.Schema.Types.ObjectId, ref: "PromoCode", default: null },
    subtotal: { type: Number, required: true, default: 0 },
    discount_amount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "refunded"],
      required: true,
      default: "pending",
    },
    payment_status: {
      type: String,
      enum: ["not_required", "pending", "paid", "refunded", "partially_refunded", "failed"],
      required: true,
      default: "pending",
    },
    payment_method: { type: String, default: null },
    buyer_name: { type: String, required: true },
    buyer_email: { type: String, required: true },
    cancelled_at: { type: Date, default: null },
    refunded_at: { type: Date, default: null },
    confirmed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ordersSchema.index({ event_id: 1, status: 1 });
ordersSchema.index({ user_id: 1 });
ordersSchema.index({ status: 1 });
ordersSchema.index({ buyer_email: 1 });

module.exports = mongoose.model("Order", ordersSchema);
