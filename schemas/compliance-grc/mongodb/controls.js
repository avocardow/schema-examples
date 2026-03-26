// controls: Security and compliance controls implemented by the organization.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const controlSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    identifier: { type: String, unique: true, sparse: true, default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    control_type: {
      type: String,
      enum: ["preventive", "detective", "corrective", "directive"],
      required: true,
    },
    category: {
      type: String,
      enum: ["technical", "administrative", "physical"],
      required: true,
    },
    frequency: {
      type: String,
      enum: ["continuous", "daily", "weekly", "monthly", "quarterly", "annually", "as_needed"],
      required: true,
      default: "continuous",
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "deprecated"],
      required: true,
      default: "draft",
    },
    effectiveness: {
      type: String,
      enum: ["effective", "partially_effective", "ineffective", "not_assessed"],
      required: true,
      default: "not_assessed",
    },
    implementation_notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

controlSchema.index({ organization_id: 1 });
controlSchema.index({ owner_id: 1 });
controlSchema.index({ status: 1 });
controlSchema.index({ control_type: 1 });
controlSchema.index({ category: 1 });

module.exports = mongoose.model("Control", controlSchema);
