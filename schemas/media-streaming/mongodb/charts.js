// charts: Curated music charts (top, viral, trending) optionally scoped by region.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const chartsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    chart_type: { type: String, enum: ["top", "viral", "new_releases", "trending"], required: true },
    region: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

chartsSchema.index({ chart_type: 1, region: 1 });
chartsSchema.index({ is_active: 1 });

module.exports = mongoose.model("Chart", chartsSchema);
