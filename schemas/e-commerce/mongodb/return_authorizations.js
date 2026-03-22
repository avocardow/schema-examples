// return_authorizations: Manages RMA requests for order returns, tracking approval workflow and refund outcomes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const returnAuthorizationsSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    rma_number: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "received", "refunded", "canceled"],
      required: true,
      default: "requested",
    },
    reason: { type: String, default: null },
    note: { type: String, default: null },
    refund_amount: { type: Number, default: null },
    currency: { type: String, required: true },
    requested_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    received_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

returnAuthorizationsSchema.index({ order_id: 1 });
returnAuthorizationsSchema.index({ status: 1 });
returnAuthorizationsSchema.index({ created_at: 1 });

module.exports = mongoose.model("ReturnAuthorization", returnAuthorizationsSchema);
