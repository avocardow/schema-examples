// funnel_steps: Ordered steps within a conversion funnel tied to event types.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const funnelStepsSchema = new mongoose.Schema(
  {
    funnel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Funnel", required: true },
    event_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventType", required: true },
    step_order: { type: Number, required: true },
    name: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

funnelStepsSchema.index({ funnel_id: 1, step_order: 1 }, { unique: true });
funnelStepsSchema.index({ funnel_id: 1, event_type_id: 1 }, { unique: true });

module.exports = mongoose.model("FunnelStep", funnelStepsSchema);
