// roles: Named sets of permissions with environment or organization scope.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true }, // Human-readable key (e.g., "admin", "org:editor").
    name: { type: String, required: true }, // Display name for admin UIs.
    description: { type: String },

    // "environment" = app-wide. "organization" = within an org only.
    scope: { type: String, enum: ["environment", "organization"], required: true },

    // System roles cannot be deleted. Prevents accidental lockout.
    is_system: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

rolesSchema.index({ scope: 1 });

module.exports = mongoose.model("Role", rolesSchema);
