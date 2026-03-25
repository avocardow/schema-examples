// tenant_settings: Per-organization configuration key-value pairs.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const tenantSettingsSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tenantSettingsSchema.index({ organization_id: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("TenantSetting", tenantSettingsSchema);
