// chart_entries: Individual track positions within a chart for a given date.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const chartEntriesSchema = new mongoose.Schema(
  {
    chart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chart", required: true },
    track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
    position: { type: Number, required: true },
    previous_position: { type: Number, default: null },
    peak_position: { type: Number, required: true },
    weeks_on_chart: { type: Number, required: true, default: 1 },
    chart_date: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

chartEntriesSchema.index({ chart_id: 1, chart_date: 1, position: 1 });
chartEntriesSchema.index({ track_id: 1, chart_date: 1 });

module.exports = mongoose.model("ChartEntry", chartEntriesSchema);
