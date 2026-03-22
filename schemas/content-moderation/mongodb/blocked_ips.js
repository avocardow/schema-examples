// blocked_ips: IP-level access blocking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const blockedIpsSchema = new mongoose.Schema(
  {
    ip_address: { type: String, unique: true, required: true }, // IP address or CIDR range (e.g., "192.168.1.100", "10.0.0.0/8").

    // sign_up_block = prevent new account creation from this IP.
    // login_block = prevent login from this IP.
    // full_block = block all access from this IP.
    severity: {
      type: String,
      enum: ["sign_up_block", "login_block", "full_block"],
      required: true,
      default: "full_block",
    },

    reason: { type: String, default: null }, // Why this IP was blocked.
    expires_at: { type: Date, default: null }, // When this block expires. Null = permanent.
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
blockedIpsSchema.index({ severity: 1 });
blockedIpsSchema.index({ expires_at: 1 });
blockedIpsSchema.index({ created_by: 1 });

module.exports = mongoose.model("BlockedIp", blockedIpsSchema);
