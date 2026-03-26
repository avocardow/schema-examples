// audit_findings: Issues and observations discovered during audits.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const auditFindingSchema = new mongoose.Schema(
  {
    audit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Audit", required: true },
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: "Control", default: null },
    risk_id: { type: mongoose.Schema.Types.ObjectId, ref: "Risk", default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    severity: {
      type: String,
      enum: ["critical", "high", "medium", "low", "informational"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "remediated", "accepted", "closed"],
      required: true,
      default: "open",
    },
    due_date: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

auditFindingSchema.index({ audit_id: 1 });
auditFindingSchema.index({ control_id: 1 });
auditFindingSchema.index({ risk_id: 1 });
auditFindingSchema.index({ severity: 1 });
auditFindingSchema.index({ status: 1 });

module.exports = mongoose.model("AuditFinding", auditFindingSchema);
