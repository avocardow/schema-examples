// earning_types: Classification of earning categories (regular, overtime, bonus, etc.) with tax flags.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const earningTypesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    category: {
      type: String,
      enum: ["regular", "overtime", "bonus", "commission", "reimbursement", "other"],
      required: true,
    },
    is_taxable: { type: Boolean, required: true, default: true },
    is_active: { type: Boolean, required: true, default: true },
    description: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

earningTypesSchema.index({ code: 1 }, { unique: true });
earningTypesSchema.index({ category: 1 });
earningTypesSchema.index({ is_active: 1 });

module.exports = mongoose.model("EarningType", earningTypesSchema);
