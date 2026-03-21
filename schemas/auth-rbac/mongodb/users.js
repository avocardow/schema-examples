// users: Central identity record. One row per human (or anonymous) user.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true }, // Always store lowercase. Nullable for anonymous or phone-only users.
    email_verified_at: { type: Date },
    phone: { type: String, unique: true, sparse: true }, // E.164 format (e.g., "+15551234567").
    phone_verified_at: { type: Date },
    name: { type: String }, // Display name. Not used for auth.
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String, unique: true, sparse: true },
    image_url: { type: String },

    is_anonymous: { type: Boolean, required: true, default: false }, // Guest users that can upgrade to full accounts.

    // Ban = admin decision (ToS violation). Lock = automated (brute-force protection).
    banned: { type: Boolean, required: true, default: false },
    banned_reason: { type: String },
    banned_until: { type: Date }, // Null = permanent ban.
    locked: { type: Boolean, required: true, default: false },
    locked_until: { type: Date }, // Auto-unlock after this time.
    failed_login_attempts: { type: Number, required: true, default: 0 }, // Reset to 0 on successful login. Lock when threshold hit.
    last_failed_login_at: { type: Date },

    // Two-tier metadata prevents privilege escalation via client-side manipulation.
    // public: client-readable, server-writable (preferences, theme).
    // private: server-only (Stripe ID, internal notes). Never expose to client.
    public_metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    private_metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

    external_id: { type: String, unique: true, sparse: true }, // Link to external system (legacy DB, CRM).
    last_sign_in_at: { type: Date },
    last_sign_in_ip: { type: String }, // Consider privacy regulations before storing.
    sign_in_count: { type: Number, required: true, default: 0 },

    // Soft delete: keeps row for audit trails, but may conflict with GDPR/CCPA
    // hard-delete requirements. See README for trade-off discussion.
    deleted_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

usersSchema.index({ external_id: 1 });
usersSchema.index({ created_at: 1 });

module.exports = mongoose.model("User", usersSchema);
