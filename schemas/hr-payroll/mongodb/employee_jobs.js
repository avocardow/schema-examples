// employee_jobs: Tracks job assignments linking employees to positions, departments, and managers.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const employeeJobsSchema = new mongoose.Schema(
  {
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position", default: null },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    title: { type: String, required: true },
    employment_type: {
      type: String,
      enum: ["full_time", "part_time", "contractor", "intern", "temporary"],
      required: true,
    },
    effective_date: { type: String, required: true },
    end_date: { type: String, default: null },
    reason: { type: String, default: null },
    is_primary: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

employeeJobsSchema.index({ employee_id: 1 });
employeeJobsSchema.index({ position_id: 1 });
employeeJobsSchema.index({ department_id: 1 });
employeeJobsSchema.index({ manager_id: 1 });
employeeJobsSchema.index({ effective_date: 1 });

module.exports = mongoose.model("EmployeeJob", employeeJobsSchema);
