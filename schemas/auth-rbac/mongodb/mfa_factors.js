// mfa_factors: Enrolled MFA methods. One row per factor a user has set up.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const mfaFactorsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    factor_type: { type: String, enum: ["totp", "webauthn", "phone", "email"], required: true },
    friendly_name: { type: String }, // User-assigned label, e.g., "My YubiKey".

    // Lifecycle: unverified → verified → disabled.
    // Only "verified" factors should be accepted for authentication.
    status: { type: String, enum: ["unverified", "verified", "disabled"], required: true, default: "unverified" },

    // Secrets: only one is populated, depending on factor_type.
    secret: { type: String }, // Encrypted TOTP secret. Must be encrypted at rest.
    phone: { type: String }, // E.164 phone number. Only for factor_type=phone.
    webauthn_credential: { type: mongoose.Schema.Types.Mixed }, // WebAuthn public key credential data.
    webauthn_aaguid: { type: String }, // Authenticator Attestation GUID.

    last_used_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

mfaFactorsSchema.index({ user_id: 1 });
mfaFactorsSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model("MfaFactor", mfaFactorsSchema);
