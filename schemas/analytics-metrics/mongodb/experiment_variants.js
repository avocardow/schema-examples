// experiment_variants: Variant definitions within an experiment including control and weight.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const experimentVariantsSchema = new mongoose.Schema(
  {
    experiment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    is_control: { type: Boolean, required: true, default: false },
    weight: { type: Number, required: true, default: 0.5 },
    config: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

experimentVariantsSchema.index({ experiment_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("ExperimentVariant", experimentVariantsSchema);
