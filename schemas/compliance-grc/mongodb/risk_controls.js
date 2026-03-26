// risk_controls: Maps risks to mitigating controls (many-to-many).
// See README.md for full design rationale.
const mongoose = require("mongoose");

const riskControlSchema = new mongoose.Schema(
  {
    risk_id: { type: mongoose.Schema.Types.ObjectId, ref: "Risk", required: true },
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: "Control", required: true },
    effectiveness_notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

riskControlSchema.index({ risk_id: 1, control_id: 1 }, { unique: true });

module.exports = mongoose.model("RiskControl", riskControlSchema);
