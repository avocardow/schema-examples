// organization_invitations: Pending invitations to join an organization.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const organizationInvitationsSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    email: { type: String, required: true }, // Invitee's email. They may not have an account yet.
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // Role they'll get upon acceptance.

    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "revoked"],
      required: true,
      default: "pending",
    },

    token_hash: { type: String, unique: true, required: true }, // Hashed invitation token. Raw token sent in invite email.
    inviter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who sent the invitation.
    expires_at: { type: Date, required: true }, // Typically 7 days.
    accepted_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

organizationInvitationsSchema.index({ organization_id: 1, status: 1 });
organizationInvitationsSchema.index({ email: 1 });

module.exports = mongoose.model("OrganizationInvitation", organizationInvitationsSchema);
