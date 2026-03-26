// evidence: Supporting evidence collected for controls and audits.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: "Control", required: true },
    audit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Audit", default: null },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", default: null },
    collected_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true },
    evidence_type: {
      type: String,
      enum: ["document", "screenshot", "log_export", "automated_test", "manual_review", "certification"],
      required: true,
    },
    description: { type: String, default: null },
    collected_at: { type: Date, required: true },
    valid_from: { type: String, default: null },
    valid_until: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

evidenceSchema.index({ control_id: 1 });
evidenceSchema.index({ audit_id: 1 });
evidenceSchema.index({ collected_by: 1 });
evidenceSchema.index({ evidence_type: 1 });
evidenceSchema.index({ collected_at: 1 });

module.exports = mongoose.model("Evidence", evidenceSchema);
