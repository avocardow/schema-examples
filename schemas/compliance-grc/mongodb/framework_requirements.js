// framework_requirements: Individual requirements or controls within a framework.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const frameworkRequirementSchema = new mongoose.Schema(
  {
    framework_id: { type: mongoose.Schema.Types.ObjectId, ref: "Framework", required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "FrameworkRequirement", default: null },
    identifier: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    sort_order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

frameworkRequirementSchema.index({ framework_id: 1, identifier: 1 }, { unique: true });
frameworkRequirementSchema.index({ parent_id: 1 });
frameworkRequirementSchema.index({ sort_order: 1 });

module.exports = mongoose.model("FrameworkRequirement", frameworkRequirementSchema);
