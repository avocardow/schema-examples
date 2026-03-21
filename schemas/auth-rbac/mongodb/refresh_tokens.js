// refresh_tokens: Long-lived tokens for obtaining new access tokens without re-authentication.
// Supports rotation chains for reuse detection.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const refreshTokensSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    token_hash: { type: String, unique: true, required: true }, // Hashed token. Raw token sent to client.

    // Rotation chain: each new token points to the token it replaced.
    // Null = first token in the chain (issued at login).
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "RefreshToken" },

    revoked: { type: Boolean, required: true, default: false },
    revoked_at: { type: Date }, // When this token was revoked (by rotation or explicit logout).
    expires_at: { type: Date, required: true }, // Typically 7–30 days.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

refreshTokensSchema.index({ session_id: 1 });
refreshTokensSchema.index({ parent_id: 1 });

module.exports = mongoose.model("RefreshToken", refreshTokensSchema);
