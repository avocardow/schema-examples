// sessions: Active login sessions. Tracks *how* the user authenticated, not just *that* they did.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const sessionsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token_hash: { type: String, unique: true, required: true }, // SHA-256 hash. Never store raw session tokens.

    // Authentication Assurance Level: aal1 = password/OAuth, aal2 = MFA verified, aal3 = hardware key.
    aal: { type: String, enum: ["aal1", "aal2", "aal3"], required: true, default: "aal1" },

    mfa_factor_id: { type: mongoose.Schema.Types.ObjectId, ref: "MfaFactor" },
    ip_address: { type: String },
    user_agent: { type: String },
    country_code: { type: String, maxlength: 2 }, // ISO 3166-1 alpha-2, derived from IP.

    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Active org context for multi-tenant apps.
    impersonator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Set when an admin is impersonating this user.

    tag: { type: String }, // Custom label (e.g., "mobile", "api").
    last_active_at: { type: Date },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

sessionsSchema.index({ user_id: 1 });
sessionsSchema.index({ expires_at: 1 });

module.exports = mongoose.model("Session", sessionsSchema);
