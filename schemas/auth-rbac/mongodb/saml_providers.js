// saml_providers: SAML-specific config extending oauth_providers for enterprise SSO.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const samlProvidersSchema = new mongoose.Schema(
  {
    oauth_provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "OauthProvider", required: true }, // Parent provider config.
    entity_id: { type: String, unique: true, required: true }, // SAML EntityID from the IdP.
    metadata_xml: { type: String }, // Full IdP metadata XML.
    metadata_url: { type: String }, // URL to fetch IdP metadata (auto-refreshing).
    certificate: { type: String }, // IdP's X.509 signing certificate for verifying SAML assertions.
    name_id_format: { type: String }, // Expected NameID format.

    // Maps IdP attribute names to your user fields.
    attribute_mapping: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

samlProvidersSchema.index({ oauth_provider_id: 1 });

module.exports = mongoose.model("SamlProvider", samlProvidersSchema);
