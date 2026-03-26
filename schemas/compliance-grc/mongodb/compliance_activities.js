// compliance_activities: Audit trail of all compliance-related actions.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const complianceActivitySchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    actor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    activity_type: {
      type: String,
      enum: [
        "control_created",
        "control_updated",
        "control_tested",
        "risk_created",
        "risk_updated",
        "risk_closed",
        "policy_created",
        "policy_approved",
        "policy_acknowledged",
        "audit_started",
        "audit_completed",
        "finding_created",
        "finding_remediated",
        "finding_closed",
        "evidence_collected",
      ],
      required: true,
    },
    entity_type: {
      type: String,
      enum: [
        "control",
        "risk",
        "policy",
        "policy_version",
        "audit",
        "audit_finding",
        "finding_remediation",
        "evidence",
      ],
      required: true,
    },
    entity_id: { type: String, required: true },
    summary: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

complianceActivitySchema.index({ organization_id: 1 });
complianceActivitySchema.index({ actor_id: 1 });
complianceActivitySchema.index({ activity_type: 1 });
complianceActivitySchema.index({ entity_type: 1 });
complianceActivitySchema.index({ entity_id: 1 });
complianceActivitySchema.index({ created_at: 1 });

module.exports = mongoose.model("ComplianceActivity", complianceActivitySchema);
