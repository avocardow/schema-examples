// features: Feature flags and metered capabilities available for plan assignment.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    feature_type: { type: String, enum: ["boolean", "limit", "metered"], required: true },
    unit: { type: String, default: null },
    is_enabled: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

featureSchema.index({ feature_type: 1 });
featureSchema.index({ is_enabled: 1 });

module.exports = mongoose.model("Feature", featureSchema);
