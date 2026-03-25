// integration_definitions: Catalogue of available third-party integrations and their auth methods.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const integrationDefinitionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    icon_url: { type: String, default: null },
    auth_method: { type: String, enum: ["oauth2", "api_key", "webhook", "none"], required: true },
    config_schema: { type: mongoose.Schema.Types.Mixed, default: null },
    is_enabled: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

integrationDefinitionSchema.index({ is_enabled: 1 });

module.exports = mongoose.model("IntegrationDefinition", integrationDefinitionSchema);
