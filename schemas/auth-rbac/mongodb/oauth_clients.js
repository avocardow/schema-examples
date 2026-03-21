// oauth_clients: For when your app acts as an OAuth server issuing tokens to third-party apps.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const oauthClientsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Display name shown in consent screen.
    secret_hash: { type: String, required: true }, // Hashed client secret. Never store plaintext.
    redirect_uris: { type: [String], required: true }, // Allowed redirect URIs. Strictly validated.
    grant_types: { type: [String], required: true, default: [] }, // e.g., ["authorization_code", "client_credentials"].
    scopes: { type: [String], required: true, default: [] }, // Allowed scopes this client can request.

    app_type: { type: String }, // "web", "spa", "native", or "m2m".

    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Which org owns this client. Null = platform-level.
    is_first_party: { type: Boolean, required: true, default: false }, // First-party clients skip the consent screen.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

oauthClientsSchema.index({ organization_id: 1 });

module.exports = mongoose.model("OauthClient", oauthClientsSchema);
