// metric_rollups: Pre-aggregated metric values at various time granularities for fast queries.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const metricRollupsSchema = new mongoose.Schema(
  {
    metric_id: { type: mongoose.Schema.Types.ObjectId, ref: "MetricDefinition", required: true },
    granularity: { type: String, enum: ["hourly", "daily", "weekly", "monthly"], required: true },
    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },
    value: { type: Number, required: true },
    count: { type: Number, required: true, default: 0 },
    dimensions: { type: mongoose.Schema.Types.Mixed, default: null },
    computed_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

metricRollupsSchema.index({ metric_id: 1, granularity: 1, period_start: 1, dimensions: 1 }, { unique: true });
// index(metric_id, granularity, period_start) omitted — leading columns of the unique index above.
metricRollupsSchema.index({ period_start: 1 });

module.exports = mongoose.model("MetricRollup", metricRollupsSchema);
