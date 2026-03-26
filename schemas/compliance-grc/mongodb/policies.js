// policies: Organizational policies, standards, procedures, and guidelines.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    policy_type: {
      type: String,
      enum: ["policy", "standard", "procedure", "guideline"],
      required: true,
      default: "policy",
    },
    description: { type: String, default: null },
    review_frequency: {
      type: String,
      enum: ["monthly", "quarterly", "semi_annually", "annually", "biennially"],
      required: true,
      default: "annually",
    },
    next_review_date: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

policySchema.index({ organization_id: 1 });
policySchema.index({ owner_id: 1 });
policySchema.index({ policy_type: 1 });
policySchema.index({ is_active: 1 });

module.exports = mongoose.model("Policy", policySchema);
