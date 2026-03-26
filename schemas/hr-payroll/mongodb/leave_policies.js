// leave_policies: Leave/time-off policy definitions and accrual rules.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const leavePoliciesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "vacation",
        "sick",
        "personal",
        "parental",
        "bereavement",
        "jury_duty",
        "unpaid",
        "other",
      ],
      required: true,
    },
    accrual_rate: { type: Number, default: null },
    accrual_frequency: {
      type: String,
      enum: ["per_pay_period", "monthly", "quarterly", "annually", "none"],
      required: true,
      default: "none",
    },
    max_balance: { type: Number, default: null },
    max_carryover: { type: Number, default: null },
    is_paid: { type: Boolean, required: true, default: true },
    requires_approval: { type: Boolean, required: true, default: true },
    is_active: { type: Boolean, required: true, default: true },
    description: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
leavePoliciesSchema.index({ type: 1 });
leavePoliciesSchema.index({ is_active: 1 });

module.exports = mongoose.model("LeavePolicy", leavePoliciesSchema);
