// pipelines: Sales pipelines that organize deal progression stages.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pipelinesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    is_default: { type: Boolean, required: true, default: false },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

pipelinesSchema.index({ position: 1 });

module.exports = mongoose.model("Pipeline", pipelinesSchema);
