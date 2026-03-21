// oauth_providers: Configuration for external OAuth/SSO providers (Google, GitHub, SAML, etc.).
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const oauthProvidersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Display name shown in UI (e.g., "Google").
    slug: { type: String, unique: true, required: true }, // URL-safe identifier (e.g., "google", "github").
    strategy: { type: String, required: true }, // "oauth2", "oidc", or "saml".
    client_id: { type: String, required: true }, // OAuth client ID from the provider.
    client_secret: { type: String }, // Must be encrypted at rest. Nullable for public clients (PKCE).
    authorization_url: { type: String }, // Override for custom/self-hosted providers.
    token_url: { type: String }, // Override for custom providers.
    userinfo_url: { type: String }, // Override for custom providers.
    scopes: { type: [String], default: [] }, // Default scopes to request.
    enabled: { type: Boolean, required: true, default: true }, // Toggle provider on/off without deleting config.

    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Org-scoped SSO. Null = available to all users.

    metadata: { type: mongoose.Schema.Types.Mixed }, // Provider-specific config.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

oauthProvidersSchema.index({ organization_id: 1 });
oauthProvidersSchema.index({ enabled: 1 });

module.exports = mongoose.model("OauthProvider", oauthProvidersSchema);
