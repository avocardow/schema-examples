// tenant_features: Feature flags and limits assigned to each organization.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const tenantFeaturesSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    feature_id: { type: mongoose.Schema.Types.ObjectId, ref: "Feature", required: true },
    is_enabled: { type: Boolean, required: true, default: true },
    limit_value: { type: Number, default: null },
    source: { type: String, enum: ["plan", "override", "trial", "custom"], required: true, default: "plan" },
    expires_at: { type: Date, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tenantFeaturesSchema.index({ organization_id: 1, feature_id: 1 }, { unique: true });
tenantFeaturesSchema.index({ feature_id: 1 });
tenantFeaturesSchema.index({ source: 1 });
tenantFeaturesSchema.index({ expires_at: 1 });

module.exports = mongoose.model("TenantFeature", tenantFeaturesSchema);
