// payroll_runs: Tracks payroll processing runs with totals and status.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const payrollRunsSchema = new mongoose.Schema(
  {
    pay_schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: "PaySchedule", required: true },
    period_start: { type: String, required: true },
    period_end: { type: String, required: true },
    pay_date: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "processing", "completed", "failed", "voided"],
      required: true,
      default: "draft",
    },
    total_gross: { type: Number, required: true, default: 0 },
    total_deductions: { type: Number, required: true, default: 0 },
    total_net: { type: Number, required: true, default: 0 },
    employee_count: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    processed_at: { type: Date, default: null },
    processed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

payrollRunsSchema.index({ pay_schedule_id: 1 });
payrollRunsSchema.index({ status: 1 });
payrollRunsSchema.index({ pay_date: 1 });

module.exports = mongoose.model("PayrollRun", payrollRunsSchema);
