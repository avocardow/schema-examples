// pay_stub_deductions: Individual deduction line items on each pay stub with employee and employer amounts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const payStubDeductionSchema = new mongoose.Schema(
  {
    pay_stub_id: { type: mongoose.Schema.Types.ObjectId, ref: "PayStub", required: true },
    deduction_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "DeductionType", required: true },
    employee_amount: { type: Number, required: true, default: 0 },
    employer_amount: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

payStubDeductionSchema.index({ pay_stub_id: 1 });
payStubDeductionSchema.index({ deduction_type_id: 1 });

module.exports = mongoose.model("PayStubDeduction", payStubDeductionSchema);
