// mfa_challenges: In-progress MFA verification attempts.
// Tracks whether the user passed, failed, or timed out.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const mfaChallengesSchema = new mongoose.Schema(
  {
    factor_id: { type: mongoose.Schema.Types.ObjectId, ref: "MfaFactor", required: true },

    otp_code: { type: String }, // Hashed server-generated code (SMS/email factors only).
    webauthn_session_data: { type: mongoose.Schema.Types.Mixed }, // WebAuthn challenge session data.

    verified_at: { type: Date }, // Null = pending. Set when the user successfully verifies.
    expires_at: { type: Date, required: true }, // Short-lived: 5–10 minutes.
    ip_address: { type: String }, // Where the challenge was initiated.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

mfaChallengesSchema.index({ factor_id: 1 });
mfaChallengesSchema.index({ expires_at: 1 });

module.exports = mongoose.model("MfaChallenge", mfaChallengesSchema);
