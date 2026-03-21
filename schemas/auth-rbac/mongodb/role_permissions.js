// role_permissions: Junction table linking roles to permissions.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const rolePermissionsSchema = new mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  permission_id: { type: mongoose.Schema.Types.ObjectId, ref: "Permission", required: true },
});

rolePermissionsSchema.index({ role_id: 1, permission_id: 1 }, { unique: true });
rolePermissionsSchema.index({ permission_id: 1 });

module.exports = mongoose.model("RolePermission", rolePermissionsSchema);
