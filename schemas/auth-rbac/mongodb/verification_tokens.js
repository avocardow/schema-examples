// verification_tokens: Unified table for all one-time tokens (email verification,
// password reset, magic links, phone verification, invitations).
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const verificationTokensSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Nullable — some tokens exist before a user record.
    token_hash: { type: String, unique: true, required: true }, // SHA-256 hash. Never store raw tokens.

    type: {
      type: String,
      enum: ["email_verification", "phone_verification", "password_reset", "magic_link", "invitation"],
      required: true,
    },

    identifier: { type: String, required: true }, // Email or phone number this token targets.
    expires_at: { type: Date, required: true }, // Short-lived. Email: 24h, password reset: 1h, magic link: 15min.
    used_at: { type: Date }, // Null = unused. Set when consumed to prevent replay attacks.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

verificationTokensSchema.index({ identifier: 1, type: 1 });
verificationTokensSchema.index({ expires_at: 1 });

module.exports = mongoose.model("VerificationToken", verificationTokensSchema);
