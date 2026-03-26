// leave_balances: Employee leave balances tracking accrued, used, and carried-over days per year.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const leaveBalanceSchema = new mongoose.Schema(
  {
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    leave_policy_id: { type: mongoose.Schema.Types.ObjectId, ref: "LeavePolicy", required: true },
    balance: { type: Number, required: true, default: 0 },
    accrued: { type: Number, required: true, default: 0 },
    used: { type: Number, required: true, default: 0 },
    carried_over: { type: Number, required: true, default: 0 },
    year: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

leaveBalanceSchema.index({ employee_id: 1, leave_policy_id: 1, year: 1 }, { unique: true });
leaveBalanceSchema.index({ leave_policy_id: 1 });

module.exports = mongoose.model("LeaveBalance", leaveBalanceSchema);
