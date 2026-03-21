// organization_members: Links users to organizations with a role.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const organizationMembersSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, // Must be a role with scope=organization.

    // "active" = normal member. "inactive" = suspended but not removed.
    status: { type: String, enum: ["active", "inactive"], required: true, default: "active" },

    directory_managed: { type: Boolean, required: true, default: false }, // SCIM-provisioned memberships.

    custom_attributes: { type: mongoose.Schema.Types.Mixed }, // Org-specific metadata (e.g., department, title).
    invited_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joined_at: { type: Date }, // When the user accepted the invitation.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

organizationMembersSchema.index({ organization_id: 1, user_id: 1 }, { unique: true });
organizationMembersSchema.index({ user_id: 1 });
organizationMembersSchema.index({ organization_id: 1, status: 1 });

module.exports = mongoose.model("OrganizationMember", organizationMembersSchema);
