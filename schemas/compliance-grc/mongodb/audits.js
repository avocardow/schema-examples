// audits: Internal and external audit engagements.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    lead_auditor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    audit_type: {
      type: String,
      enum: ["internal", "external", "self_assessment", "certification"],
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "review", "completed", "cancelled"],
      required: true,
      default: "planned",
    },
    scope: { type: String, default: null },
    start_date: { type: String, default: null },
    end_date: { type: String, default: null },
    conclusion: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

auditSchema.index({ organization_id: 1 });
auditSchema.index({ lead_auditor_id: 1 });
auditSchema.index({ audit_type: 1 });
auditSchema.index({ status: 1 });

module.exports = mongoose.model("Audit", auditSchema);
