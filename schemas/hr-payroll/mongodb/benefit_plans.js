// benefit_plans: Employer-sponsored benefit plans (health, dental, retirement, etc.) with contribution details.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const benefitPlansSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "health",
        "dental",
        "vision",
        "retirement_401k",
        "life_insurance",
        "disability",
        "hsa",
        "fsa",
        "other",
      ],
      required: true,
    },
    description: { type: String, default: null },
    employer_contribution: { type: Number, default: null },
    employee_contribution: { type: Number, default: null },
    currency: { type: String, required: true, default: "USD" },
    is_active: { type: Boolean, required: true, default: true },
    plan_year_start: { type: String, default: null },
    plan_year_end: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

benefitPlansSchema.index({ type: 1 });
benefitPlansSchema.index({ is_active: 1 });

module.exports = mongoose.model("BenefitPlan", benefitPlansSchema);
