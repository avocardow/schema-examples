// order_status_history: Records each status transition for an order, providing a full audit trail.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const orderStatusHistorySchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    from_status: { type: String, default: null },
    to_status: { type: String, required: true },
    changed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    note: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
orderStatusHistorySchema.index({ order_id: 1, created_at: 1 });
module.exports = mongoose.model("OrderStatusHistory", orderStatusHistorySchema);
