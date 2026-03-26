// pay_stubs: Per-employee pay stub generated for each payroll run.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const payStubsSchema = new mongoose.Schema(
  {
    payroll_run_id: { type: mongoose.Schema.Types.ObjectId, ref: "PayrollRun", required: true },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    gross_pay: { type: Number, required: true, default: 0 },
    total_deductions: { type: Number, required: true, default: 0 },
    net_pay: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    pay_date: { type: String, required: true },
    period_start: { type: String, required: true },
    period_end: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

payStubsSchema.index({ payroll_run_id: 1, employee_id: 1 }, { unique: true });
payStubsSchema.index({ employee_id: 1 });
payStubsSchema.index({ pay_date: 1 });

module.exports = mongoose.model("PayStub", payStubsSchema);
