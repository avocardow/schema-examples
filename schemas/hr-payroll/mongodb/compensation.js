// compensation: Employee compensation records with pay type, amount, and frequency.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const compensationSchema = new mongoose.Schema(
  {
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    pay_type: {
      type: String,
      enum: ["salary", "hourly"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    pay_frequency: {
      type: String,
      enum: ["weekly", "biweekly", "semimonthly", "monthly", "annually"],
      required: true,
    },
    effective_date: { type: String, required: true },
    end_date: { type: String, default: null },
    reason: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

compensationSchema.index({ employee_id: 1 });
compensationSchema.index({ effective_date: 1 });

module.exports = mongoose.model("Compensation", compensationSchema);
