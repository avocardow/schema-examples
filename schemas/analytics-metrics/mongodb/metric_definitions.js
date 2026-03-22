// metric_definitions: Reusable metric formulas with aggregation type, filters, and display format.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const metricDefinitionsSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    display_name: { type: String, required: true },
    description: { type: String, default: null },
    aggregation: { type: String, enum: ["count", "sum", "average", "min", "max", "count_unique", "percentile"], required: true },
    event_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventType", default: null },
    property_key: { type: String, default: null },
    filters: { type: mongoose.Schema.Types.Mixed, default: null },
    unit: { type: String, default: null },
    format: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

metricDefinitionsSchema.index({ event_type_id: 1 });
metricDefinitionsSchema.index({ aggregation: 1 });
metricDefinitionsSchema.index({ is_active: 1 });
metricDefinitionsSchema.index({ created_by: 1 });

module.exports = mongoose.model("MetricDefinition", metricDefinitionsSchema);
