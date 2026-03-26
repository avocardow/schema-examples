// leave_requests: Employee leave/time-off requests and approval tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const leaveRequestsSchema = new mongoose.Schema(
  {
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    leave_policy_id: { type: mongoose.Schema.Types.ObjectId, ref: "LeavePolicy", required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    days_requested: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], required: true, default: "pending" },
    reason: { type: String, default: null },
    reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewed_at: { type: Date, default: null },
    reviewer_note: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

leaveRequestsSchema.index({ employee_id: 1 });
leaveRequestsSchema.index({ leave_policy_id: 1 });
leaveRequestsSchema.index({ status: 1 });
leaveRequestsSchema.index({ start_date: 1 });

module.exports = mongoose.model("LeaveRequest", leaveRequestsSchema);
