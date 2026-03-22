// dashboard_widgets: Individual chart or data widgets placed on a dashboard.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const dashboardWidgetsSchema = new mongoose.Schema(
  {
    dashboard_id: { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard", required: true },
    metric_id: { type: mongoose.Schema.Types.ObjectId, ref: "MetricDefinition", default: null },
    title: { type: String, default: null },
    chart_type: { type: String, enum: ["line", "bar", "area", "pie", "number", "table", "funnel", "map"], required: true, default: "line" },
    config: { type: mongoose.Schema.Types.Mixed, default: null },
    position_x: { type: Number, required: true, default: 0 },
    position_y: { type: Number, required: true, default: 0 },
    width: { type: Number, required: true, default: 6 },
    height: { type: Number, required: true, default: 4 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

dashboardWidgetsSchema.index({ dashboard_id: 1 });
dashboardWidgetsSchema.index({ metric_id: 1 });

module.exports = mongoose.model("DashboardWidget", dashboardWidgetsSchema);
