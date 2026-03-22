// dashboards: Configurable analytics dashboards with layout and refresh settings.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const dashboardsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    layout: { type: mongoose.Schema.Types.Mixed, default: null },
    visibility: { type: String, enum: ["private", "team", "public"], required: true, default: "private" },
    is_default: { type: Boolean, required: true, default: false },
    refresh_interval: { type: Number, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

dashboardsSchema.index({ created_by: 1 });
dashboardsSchema.index({ visibility: 1 });
dashboardsSchema.index({ is_default: 1 });

module.exports = mongoose.model("Dashboard", dashboardsSchema);
