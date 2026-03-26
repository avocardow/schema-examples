// risks: Identified risks tracked by the organization.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    identifier: { type: String, unique: true, sparse: true, default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    category: {
      type: String,
      enum: ["strategic", "operational", "financial", "compliance", "reputational", "technical", "third_party"],
      required: true,
    },
    likelihood: { type: Number, required: true, default: 3 },
    impact: { type: Number, required: true, default: 3 },
    risk_level: {
      type: String,
      enum: ["critical", "high", "medium", "low", "very_low"],
      required: true,
      default: "medium",
    },
    treatment: {
      type: String,
      enum: ["mitigate", "accept", "transfer", "avoid"],
      required: true,
      default: "mitigate",
    },
    status: {
      type: String,
      enum: ["identified", "assessing", "treating", "monitoring", "closed"],
      required: true,
      default: "identified",
    },
    due_date: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

riskSchema.index({ organization_id: 1 });
riskSchema.index({ owner_id: 1 });
riskSchema.index({ category: 1 });
riskSchema.index({ risk_level: 1 });
riskSchema.index({ status: 1 });

module.exports = mongoose.model("Risk", riskSchema);
