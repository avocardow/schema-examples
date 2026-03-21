// oauth_authorization_codes: Short-lived codes for the OAuth authorization code flow.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const oauthAuthorizationCodesSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "OauthClient", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code_hash: { type: String, unique: true, required: true }, // Hashed authorization code. Single-use.
    redirect_uri: { type: String, required: true }, // Must match the redirect_uri from the authorization request.
    scope: { type: String }, // Scopes granted by the user.

    // PKCE: required for public clients (SPAs, mobile apps).
    code_challenge: { type: String },
    code_challenge_method: { type: String }, // "S256" (recommended) or "plain".

    expires_at: { type: Date, required: true }, // Very short-lived: 30 seconds to 10 minutes.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

oauthAuthorizationCodesSchema.index({ expires_at: 1 });

module.exports = mongoose.model("OauthAuthorizationCode", oauthAuthorizationCodesSchema);
