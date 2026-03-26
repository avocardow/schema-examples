// employees: Employee profile and employment details.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const employeesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    employee_number: { type: String, default: null },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    date_of_birth: { type: String, default: null },
    hire_date: { type: String, required: true },
    termination_date: { type: String, default: null },
    employment_type: { type: String, enum: ["full_time", "part_time", "contractor", "intern", "temporary"], required: true },
    status: { type: String, enum: ["active", "on_leave", "suspended", "terminated"], required: true, default: "active" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

employeesSchema.index({ employee_number: 1 }, { unique: true, sparse: true });
employeesSchema.index({ user_id: 1 });
employeesSchema.index({ status: 1 });
employeesSchema.index({ employment_type: 1 });

module.exports = mongoose.model("Employee", employeesSchema);
