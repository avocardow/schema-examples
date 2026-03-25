// sla_policy_targets: Per-priority time targets within an SLA policy.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const slaPolicyTargetsSchema = new mongoose.Schema(
  {
    sla_policy_id: { type: mongoose.Schema.Types.ObjectId, ref: "SlaPolicy", required: true },
    priority_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketPriority", required: true },
    first_response_minutes: { type: Number, default: null },
    next_response_minutes: { type: Number, default: null },
    resolution_minutes: { type: Number, default: null },
  },
  { timestamps: false }
);

slaPolicyTargetsSchema.index({ sla_policy_id: 1, priority_id: 1 }, { unique: true });

module.exports = mongoose.model("SlaPolicyTarget", slaPolicyTargetsSchema);
