// control_requirements: Maps controls to framework requirements (many-to-many).
// See README.md for full design rationale.
const mongoose = require("mongoose");

const controlRequirementSchema = new mongoose.Schema(
  {
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: "Control", required: true },
    requirement_id: { type: mongoose.Schema.Types.ObjectId, ref: "FrameworkRequirement", required: true },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

controlRequirementSchema.index({ control_id: 1, requirement_id: 1 }, { unique: true });

module.exports = mongoose.model("ControlRequirement", controlRequirementSchema);
