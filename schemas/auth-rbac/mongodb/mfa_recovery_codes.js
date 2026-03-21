// mfa_recovery_codes: Backup codes for when a user loses access to their MFA device.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const mfaRecoveryCodesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code_hash: { type: String, required: true }, // Hashed recovery code. Plaintext shown once at generation, never again.
    used_at: { type: Date }, // Null = available. Set when consumed. A used code cannot be reused.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

mfaRecoveryCodesSchema.index({ user_id: 1 });

module.exports = mongoose.model("MfaRecoveryCode", mfaRecoveryCodesSchema);
