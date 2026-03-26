// compliance_tags: Tags for categorizing compliance entities.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const complianceTagSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    name: { type: String, required: true },
    color: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

complianceTagSchema.index({ organization_id: 1, name: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("ComplianceTag", complianceTagSchema);
