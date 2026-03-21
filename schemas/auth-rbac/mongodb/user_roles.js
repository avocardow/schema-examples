// user_roles: Assigns roles to users at the environment (app-wide) level.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const userRolesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who granted this role. Null if system-assigned.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

userRolesSchema.index({ user_id: 1, role_id: 1 }, { unique: true });
userRolesSchema.index({ user_id: 1 });
userRolesSchema.index({ role_id: 1 });

module.exports = mongoose.model("UserRole", userRolesSchema);
