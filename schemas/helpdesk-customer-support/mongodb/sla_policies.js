// sla_policies: Service level agreements defining response and resolution expectations.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const slaPoliciesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessSchedule", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

slaPoliciesSchema.index({ is_active: 1, sort_order: 1 });

module.exports = mongoose.model("SlaPolicy", slaPoliciesSchema);
