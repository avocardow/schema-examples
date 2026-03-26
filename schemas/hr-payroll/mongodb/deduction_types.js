// deduction_types: Defines categories of payroll deductions (tax, retirement, insurance, etc.).
// See README.md for full design rationale.

const mongoose = require("mongoose");

const deductionTypesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    category: {
      type: String,
      enum: ["tax", "retirement", "insurance", "garnishment", "other"],
      required: true,
    },
    is_pretax: { type: Boolean, required: true, default: false },
    is_active: { type: Boolean, required: true, default: true },
    description: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

deductionTypesSchema.index({ code: 1 }, { unique: true });
deductionTypesSchema.index({ category: 1 });
deductionTypesSchema.index({ is_active: 1 });

module.exports = mongoose.model("DeductionType", deductionTypesSchema);
