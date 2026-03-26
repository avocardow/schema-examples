// disputes: Customer-initiated disputes against vendor orders.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    vendor_order_id: { type: mongoose.Schema.Types.ObjectId, ref: "VendorOrder", required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    reason: {
      type: String,
      enum: ["not_received", "not_as_described", "defective", "wrong_item", "unauthorized", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "under_review", "escalated", "resolved_customer", "resolved_vendor", "closed"],
      required: true,
      default: "open",
    },
    description: { type: String, required: true },
    resolution_note: { type: String, default: null },
    refund_amount: { type: Number, default: null },
    currency: { type: String, required: true },
    resolved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolved_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

disputeSchema.index({ vendor_order_id: 1 });
disputeSchema.index({ customer_id: 1 });
disputeSchema.index({ vendor_id: 1, status: 1 });
disputeSchema.index({ status: 1 });

module.exports = mongoose.model("Dispute", disputeSchema);
