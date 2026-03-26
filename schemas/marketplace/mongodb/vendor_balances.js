// vendor_balances: Running balance summary for each vendor.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorBalanceSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, unique: true },
    currency: { type: String, required: true },
    available: { type: Number, required: true, default: 0 },
    pending: { type: Number, required: true, default: 0 },
    total_earned: { type: Number, required: true, default: 0 },
    total_paid_out: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);

module.exports = mongoose.model("VendorBalance", vendorBalanceSchema);
