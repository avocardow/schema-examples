// api_keys: Long-lived API keys for programmatic access (scripts, CI/CD, integrations).
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const apiKeysSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Null for org-level keys.
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Null for personal keys.
    name: { type: String, required: true }, // User-assigned label (e.g., "CI/CD Pipeline").
    key_prefix: { type: String, required: true }, // First 8 chars for identification (e.g., "sk_live_Ab").
    key_hash: { type: String, unique: true, required: true }, // SHA-256 hash. Used for lookup on every API request.

    scopes: { type: [String] }, // e.g., ["read:users", "write:posts"]. Null handling = app decision.

    last_used_at: { type: Date },
    last_used_ip: { type: String },
    expires_at: { type: Date }, // Null = never expires.
    revoked_at: { type: Date }, // Null = active. Set to revoke without deleting.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

apiKeysSchema.index({ user_id: 1 });
apiKeysSchema.index({ organization_id: 1 });

module.exports = mongoose.model("ApiKey", apiKeysSchema);
