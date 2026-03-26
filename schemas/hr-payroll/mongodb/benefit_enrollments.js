// benefit_enrollments: Employee benefit enrollment records with coverage level, contributions, and status.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const benefitEnrollmentSchema = new mongoose.Schema(
  {
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    benefit_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: "BenefitPlan", required: true },
    coverage_level: {
      type: String,
      enum: ["employee_only", "employee_spouse", "employee_children", "family"],
      required: true,
      default: "employee_only",
    },
    employee_contribution: { type: Number, required: true, default: 0 },
    employer_contribution: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    effective_date: { type: String, required: true },
    end_date: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "pending", "terminated", "waived"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

benefitEnrollmentSchema.index({ employee_id: 1 });
benefitEnrollmentSchema.index({ benefit_plan_id: 1 });
benefitEnrollmentSchema.index({ status: 1 });
benefitEnrollmentSchema.index({ effective_date: 1 });

module.exports = mongoose.model("BenefitEnrollment", benefitEnrollmentSchema);
