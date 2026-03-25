// custom_domains: Custom domain mappings with verification and SSL tracking per organization.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const customDomainSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    domain: { type: String, unique: true, required: true },
    verification_method: { type: String, enum: ["cname", "txt"], required: true, default: "cname" },
    verification_token: { type: String, required: true },
    is_verified: { type: Boolean, required: true, default: false },
    verified_at: { type: Date, default: null },
    ssl_status: { type: String, enum: ["pending", "active", "failed", "expired"], required: true, default: "pending" },
    ssl_expires_at: { type: Date, default: null },
    is_primary: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customDomainSchema.index({ organization_id: 1 });

module.exports = mongoose.model("CustomDomain", customDomainSchema);
