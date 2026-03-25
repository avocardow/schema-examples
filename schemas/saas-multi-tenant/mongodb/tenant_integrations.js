// tenant_integrations: Active integration connections per organization with credentials and sync state.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const tenantIntegrationSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    integration_id: { type: mongoose.Schema.Types.ObjectId, ref: "IntegrationDefinition", required: true },
    status: { type: String, enum: ["active", "inactive", "error"], required: true, default: "active" },
    encrypted_credentials: { type: mongoose.Schema.Types.Mixed, default: null },
    config: { type: mongoose.Schema.Types.Mixed, default: null },
    connected_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    last_synced_at: { type: Date, default: null },
    error_message: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tenantIntegrationSchema.index({ organization_id: 1, integration_id: 1 }, { unique: true });
tenantIntegrationSchema.index({ integration_id: 1 });
tenantIntegrationSchema.index({ status: 1 });

module.exports = mongoose.model("TenantIntegration", tenantIntegrationSchema);
