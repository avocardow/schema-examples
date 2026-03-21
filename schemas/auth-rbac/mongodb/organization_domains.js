// organization_domains: Verified domains owned by an organization for auto-join and branding.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const organizationDomainsSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    domain: { type: String, unique: true, required: true }, // e.g., "acme.com". Lowercase, no protocol prefix.
    verified: { type: Boolean, required: true, default: false }, // Only verified domains trigger auto-join.

    verification_method: { type: String }, // "dns" (TXT record), "email", etc.
    verification_token: { type: String }, // Token/value the org needs to set in DNS or confirm via email.
    verified_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

organizationDomainsSchema.index({ organization_id: 1 });

module.exports = mongoose.model("OrganizationDomain", organizationDomainsSchema);
