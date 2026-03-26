// pay_stub_earnings: Individual earning line items on a pay stub with hours, rate, and amount.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const payStubEarningSchema = new mongoose.Schema(
  {
    pay_stub_id: { type: mongoose.Schema.Types.ObjectId, ref: "PayStub", required: true },
    earning_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EarningType", required: true },
    hours: { type: Number, default: null },
    rate: { type: Number, default: null },
    amount: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

payStubEarningSchema.index({ pay_stub_id: 1 });
payStubEarningSchema.index({ earning_type_id: 1 });

module.exports = mongoose.model("PayStubEarning", payStubEarningSchema);
