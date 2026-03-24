// pipeline_stages: Ordered stages within a sales pipeline with win probability.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pipelineStagesSchema = new mongoose.Schema(
  {
    pipeline_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pipeline", required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
    win_probability: { type: Number, default: null },
    is_closed_won: { type: Boolean, required: true, default: false },
    is_closed_lost: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

pipelineStagesSchema.index({ pipeline_id: 1, position: 1 });

module.exports = mongoose.model("PipelineStage", pipelineStagesSchema);
