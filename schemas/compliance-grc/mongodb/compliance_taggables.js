// compliance_taggables: Polymorphic join table linking tags to compliance entities.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const complianceTaggableSchema = new mongoose.Schema(
  {
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "ComplianceTag", required: true },
    taggable_type: {
      type: String,
      enum: ["control", "risk", "policy", "audit", "finding", "evidence"],
      required: true,
    },
    taggable_id: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

complianceTaggableSchema.index({ tag_id: 1, taggable_type: 1, taggable_id: 1 }, { unique: true });

module.exports = mongoose.model("ComplianceTaggable", complianceTaggableSchema);
