// organizations: Tenant / workspace / company. Top-level grouping for multi-tenant apps.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const organizationsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Display name (e.g., "Acme Corporation").
    slug: { type: String, unique: true, required: true }, // URL-safe identifier (e.g., "acme-corp").
    logo_url: { type: String },

    external_id: { type: String, unique: true, sparse: true }, // Cross-system reference.
    stripe_customer_id: { type: String, unique: true, sparse: true }, // Direct Stripe link.

    max_members: { type: Number }, // Plan-based member limit. Null = unlimited.
    public_metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Client-readable, server-writable.
    private_metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Server-only.

    // Soft delete. Same GDPR considerations as users.
    deleted_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Organization", organizationsSchema);
