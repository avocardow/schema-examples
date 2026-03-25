// plans: Available subscription plans.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const plansSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

plansSchema.index({ is_active: 1 });
plansSchema.index({ provider_type: 1, provider_id: 1 });

module.exports = mongoose.model("Plan", plansSchema);
