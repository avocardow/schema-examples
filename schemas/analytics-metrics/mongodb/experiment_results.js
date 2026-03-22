// experiment_results: Statistical results per variant and metric with confidence intervals.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const experimentResultsSchema = new mongoose.Schema(
  {
    experiment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ExperimentVariant", required: true },
    metric_id: { type: mongoose.Schema.Types.ObjectId, ref: "MetricDefinition", required: true },
    sample_size: { type: Number, required: true, default: 0 },
    mean_value: { type: Number, default: null },
    stddev: { type: Number, default: null },
    ci_lower: { type: Number, default: null },
    ci_upper: { type: Number, default: null },
    p_value: { type: Number, default: null },
    lift: { type: Number, default: null },
    is_significant: { type: Boolean, required: true, default: false },
    computed_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

experimentResultsSchema.index({ experiment_id: 1, variant_id: 1, metric_id: 1 }, { unique: true });

module.exports = mongoose.model("ExperimentResult", experimentResultsSchema);
