// accounts: Unified authentication methods. One row per way a user can sign in.
// Combines OAuth, email+password, magic link, and passkey logins in one table.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const accountsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true }, // e.g., "google", "github", "credential".
    provider_account_id: { type: String, required: true }, // User's ID at the provider. For "credential", use their email.

    // "credential" = email+password. "email" = passwordless (magic link/OTP).
    // "webauthn" = passkey as primary login (not MFA — see mfa_factors for that).
    type: { type: String, enum: ["oauth", "oidc", "email", "credential", "webauthn"], required: true },

    // Only for credential-type accounts. Use bcrypt, scrypt, or argon2id. Never store plaintext.
    password_hash: { type: String },

    // OAuth tokens for calling provider APIs on behalf of the user.
    // Encrypt at rest — these grant access to the user's external accounts.
    access_token: { type: String },
    refresh_token: { type: String }, // Provider's refresh token (not your refresh_tokens table).
    id_token: { type: String }, // OIDC ID token.
    token_expires_at: { type: Date },
    token_type: { type: String }, // Usually "bearer".
    scope: { type: String }, // OAuth scopes granted (e.g., "openid profile email").
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

accountsSchema.index({ provider: 1, provider_account_id: 1 }, { unique: true });
accountsSchema.index({ user_id: 1 });

module.exports = mongoose.model("Account", accountsSchema);
