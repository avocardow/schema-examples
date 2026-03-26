// policy_versions: Versioned snapshots of policy content and approval status.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const policyVersionSchema = new mongoose.Schema(
  {
    policy_id: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
    version_number: { type: String, required: true },
    content: { type: String, default: null },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    status: {
      type: String,
      enum: ["draft", "in_review", "approved", "archived"],
      required: true,
      default: "draft",
    },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approved_at: { type: Date, default: null },
    effective_date: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

policyVersionSchema.index({ policy_id: 1, version_number: 1 }, { unique: true });
policyVersionSchema.index({ status: 1 });
policyVersionSchema.index({ approved_by: 1 });

module.exports = mongoose.model("PolicyVersion", policyVersionSchema);
