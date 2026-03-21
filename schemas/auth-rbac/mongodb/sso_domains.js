// sso_domains: Maps email domains to SSO providers for automatic login routing.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const ssoDomainsSchema = new mongoose.Schema(
  {
    oauth_provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "OauthProvider", required: true },
    domain: { type: String, unique: true, required: true }, // e.g., "acme.com". One domain per provider.
    verified: { type: Boolean, required: true, default: false }, // Verified via DNS TXT record or email.
    verified_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

ssoDomainsSchema.index({ oauth_provider_id: 1 });

module.exports = mongoose.model("SsoDomain", ssoDomainsSchema);
