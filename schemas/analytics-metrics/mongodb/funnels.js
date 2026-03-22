// funnels: Multi-step conversion funnels with configurable time windows.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const funnelsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    conversion_window: { type: Number, required: true, default: 86400 },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

funnelsSchema.index({ is_active: 1 });
funnelsSchema.index({ created_by: 1 });

module.exports = mongoose.model("Funnel", funnelsSchema);
