// tenant_branding: Per-organization visual branding and support contact overrides.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const tenantBrandingSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", unique: true, required: true },
    logo_url: { type: String, default: null },
    logo_dark_url: { type: String, default: null },
    favicon_url: { type: String, default: null },
    primary_color: { type: String, default: null },
    accent_color: { type: String, default: null },
    background_color: { type: String, default: null },
    custom_css: { type: String, default: null },
    support_email: { type: String, default: null },
    support_url: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("TenantBranding", tenantBrandingSchema);
