// finding_remediations: Remediation actions assigned for audit findings.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const findingRemediationSchema = new mongoose.Schema(
  {
    finding_id: { type: mongoose.Schema.Types.ObjectId, ref: "AuditFinding", required: true },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      required: true,
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      required: true,
      default: "medium",
    },
    due_date: { type: String, default: null },
    completed_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

findingRemediationSchema.index({ finding_id: 1 });
findingRemediationSchema.index({ assigned_to: 1 });
findingRemediationSchema.index({ status: 1 });
findingRemediationSchema.index({ priority: 1 });
findingRemediationSchema.index({ due_date: 1 });

module.exports = mongoose.model("FindingRemediation", findingRemediationSchema);
