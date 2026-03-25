// usage_summaries: Aggregated feature usage per organization and billing period.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const usageSummarySchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    feature_id: { type: mongoose.Schema.Types.ObjectId, ref: "Feature", required: true },
    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },
    total_quantity: { type: Number, required: true, default: 0 },
    event_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

usageSummarySchema.index({ organization_id: 1, feature_id: 1, period_start: 1 }, { unique: true });
usageSummarySchema.index({ period_start: 1, period_end: 1 });

module.exports = mongoose.model("UsageSummary", usageSummarySchema);
